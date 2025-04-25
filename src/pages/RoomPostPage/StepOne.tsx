import React, { useState, useEffect, useContext } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm, SubmitHandler, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { formCreateRoom, FormCreateRoomSchema } from "../../utils/rules";
import { useMutation } from "@tanstack/react-query";
import { AppContext } from "../../contexts/app.context";
import roomApi from "../../apis/room.api.";
import mediaAPI from "../../apis/media.api";
import {
  Amenity,
  TargetAudience,
  SurroundingArea,
} from "../../types/room.type";
import Sidebar from "../MainPage/Sidebar";
import { District, Province, Ward } from "../../types/address.type";
import addressAPI from "../../apis/address.api";

const RoomPostForm = () => {
  const navigate = useNavigate();
  const { profile } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [amenitiesList, setAmenitiesList] = useState<Amenity[]>([]);
  const [targetAudiencesList, setTargetAudiencesList] = useState<
    TargetAudience[]
  >([]);
  const [surroundingAreasList, setSurroundingAreasList] = useState<
    SurroundingArea[]
  >([]);

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [streets] = useState<string[]>([
    "Đường 1A",
    "Đường 2B",
    "Đường 3C",
    "Đường 4D",
    "Đường 5E",
    "Đường 6F",
    "Đường 7G",
    "Đường 8H",
    "Đường 9I",
    "Đường 10J",
  ]);

  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedWard, setSelectedWard] = useState<string>("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Set up the form with validation
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormCreateRoomSchema>({
    resolver: yupResolver(formCreateRoom) as Resolver<FormCreateRoomSchema>,
    defaultValues: {
      userId: Number(profile?.id) || 0,
      address: {
        province: "",
        district: "",
        ward: "",
        street: "",
        houseNumber: "",
      },
      title: "",
      description: "",
      price: 0,
      area: 0,
      selfManaged: false,
      totalRooms: 1,
      maxPeople: 1,
      forGender: "ALL",
      deposit: 0,
      posterName: profile?.fullName || "",
      posterPhone: "",
      images: [],
      roomType: "BOARDING_HOUSE",
      amenities: [],
      surroundingAreas: [],
      targetAudiences: [],
      numberOfLivingRooms: 0,
      numberOfKitchens: 0,
      numberOfBathrooms: 0,
      numberOfBedrooms: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  });

  // Create mutation for room creation
  const createRoomMutation = useMutation({
    mutationFn: (data: FormCreateRoomSchema) => {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      });
      return roomApi.createRoom(formData);
    },
  });

  // Fetch required data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const amenitiesLS = localStorage.getItem(`amenities`);
        const targetAudiencesLS = localStorage.getItem(`targetAudiences`);
        const surroundingAreasLS = localStorage.getItem(`surroundingAreas`);

        // If all data is available in localStorage, use it and set loading to false
        if (amenitiesLS && targetAudiencesLS && surroundingAreasLS) {
          try {
            setAmenitiesList(JSON.parse(amenitiesLS));
            setTargetAudiencesList(JSON.parse(targetAudiencesLS));
            setSurroundingAreasList(JSON.parse(surroundingAreasLS));
            setLoading(false); // Set loading to false when data is loaded from localStorage
            return;
          } catch (error) {
            console.error("Error parsing cached data:", error);
            // Continue to API fetch if there's an error with localStorage data
          }
        }

        // Fetch amenities
        const amenitiesRes = await roomApi.getAmenities();
        setAmenitiesList(amenitiesRes.data.data);

        // Fetch target audiences
        const audiencesRes = await roomApi.getTargetAudiences();
        setTargetAudiencesList(audiencesRes.data.data);

        // Fetch surrounding areas
        const areasRes = await roomApi.getSurroundingAreas();
        setSurroundingAreasList(areasRes.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Clean up image previews when component unmounts
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  // Fetch provinces on component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      if (localStorage.getItem("provinces")) {
        const cachedProvinces = localStorage.getItem("provinces");
        if (cachedProvinces) {
          setProvinces(JSON.parse(cachedProvinces) as Province[]);
          return;
        }
      }
      try {
        setLoading(true);
        const response = await addressAPI.getProvinces();
        if (response.data && response.data.data && response.data.data.data) {
          setProvinces(response.data.data.data as Province[]);
          localStorage.setItem(
            "provinces",
            JSON.stringify(response.data.data.data as Province[])
          );
        }
      } catch (error) {
        console.error("Error fetching provinces:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProvinces();
  }, []);

  // Fetch districts when province changes
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!selectedProvince) {
        setDistricts([]);
        return;
      }

      try {
        const response = await addressAPI.getDistricts(selectedProvince);
        if (response.data && response.data.data && response.data.data.data) {
          setDistricts(response.data.data.data as District[]);
        }
      } catch (error) {
        console.error("Error fetching districts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDistricts();
    // Reset dependent fields
    setSelectedDistrict("");
    setSelectedWard("");
    setWards([]);
  }, [selectedProvince]);

  // Fetch wards when district changes
  useEffect(() => {
    const fetchWards = async () => {
      if (!selectedDistrict) {
        setWards([]);
        return;
      }

      try {
        const response = await addressAPI.getWards(selectedDistrict);
        if (response.data && response.data.data && response.data.data.data) {
          setWards(response.data.data.data as Ward[]);
        }
      } catch (error) {
        console.error("Error fetching wards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWards();
    // Reset dependent field
    setSelectedWard("");
  }, [selectedDistrict]);
  // Handle checkbox changes
  const handleCheckboxChange = (
    id: number,
    name: string,
    type: "amenities" | "targetAudiences" | "surroundingAreas",
    checked: boolean
  ) => {
    const currentValues = watch(type) || [];

    if (checked) {
      setValue(type, [...currentValues, { id, name }]);
    } else {
      setValue(
        type,
        currentValues.filter((item) => item.id !== id)
      );
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Create array from FileList
    const fileArray = Array.from(files);

    // Create preview URLs
    const previewUrls = fileArray.map((file) => URL.createObjectURL(file));

    // Update state
    setImageFiles(fileArray);
    setImagePreviews(previewUrls);
  };

  // Remove selected image
  const handleRemoveImage = (index: number) => {
    // Remove from preview
    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);

    // Remove from files
    const newFiles = [...imageFiles];
    newFiles.splice(index, 1);

    setImagePreviews(newPreviews);
    setImageFiles(newFiles);
  };

  // Upload images and return their data
  const uploadImages = async () => {
    if (imageFiles.length === 0) return [];

    try {
      let uploadedImages;
      if (imageFiles.length === 1) {
        // Upload single file
        const response = await mediaAPI.uploadFile(imageFiles[0]);
        const mediaItem = response.data.data;
        uploadedImages = [
          {
            id: mediaItem.id,
            publicId: mediaItem.public_id,
            imageUrl: mediaItem.secure_url,
          },
        ];
      } else {
        // Upload multiple files
        const response = await mediaAPI.uploadFiles(imageFiles);
        uploadedImages = response.data.data.map((media) => ({
          id: media.id,
          publicId: media.public_id,
          imageUrl: media.secure_url,
        }));
      }
      return uploadedImages;
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Không thể tải lên hình ảnh. Vui lòng thử lại.");
      throw error;
    }
  };

  // Fix the form submission handler
  const onSubmit: SubmitHandler<FormCreateRoomSchema> = async (data) => {
    try {
      setLoading(true); // Show loading indicator

      // Set the selected location values
      setValue("address.province", selectedProvince);
      setValue("address.district", selectedDistrict);
      setValue("address.ward", selectedWard);

      // First upload images
      const uploadedImages = await uploadImages();

      if (!uploadedImages || uploadedImages.length === 0) {
        toast.error("Vui lòng tải lên ít nhất một hình ảnh");
        setLoading(false);
        return;
      }

      // Create the complete data object with uploaded images
      const completeData = {
        ...data,
        images: uploadedImages,
        // Ensure selfManaged is boolean, not string
        selfManaged: data.selfManaged === true,
      };

      // Call the mutation
      await createRoomMutation.mutateAsync(completeData);

      toast.success("Đăng tin thành công!");
      navigate("/post-room");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Đăng tin thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container className="my-4">
      <Row className="m-0" style={{ minHeight: "100vh" }}>
        <Col
          xs={12}
          md={3}
          lg={2}
          className="bg-light p-3 shadow-sm vh-100"
          style={{ width: "30%" }}
        >
          <Sidebar />
        </Col>

        {/* Main Content */}
        <Col
          xs={12}
          md={9}
          lg={10}
          className="p-4 p-md-5"
          style={{ width: "70%", backgroundColor: "#white" }}
        >
          <h2 className="mb-4">Đăng tin phòng trọ</h2>

          <Form
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Hidden fields */}
            <input
              type="hidden"
              {...register("userId")}
              value={profile?.id || ""}
            />
            <input
              type="hidden"
              {...register("createdAt")}
              value={new Date().toISOString()}
            />
            <input
              type="hidden"
              {...register("updatedAt")}
              value={new Date().toISOString()}
            />

            {/* Basic Information */}
            <h4 className="mb-3">Thông tin cơ bản</h4>
            <Row className="mb-3">
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Tên phòng trọ</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ten phong tro"
                    isInvalid={!!errors.title}
                    {...register("title")}
                  />
                  {errors.title && (
                    <Form.Control.Feedback type="invalid">
                      {errors.title.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Loại phòng</Form.Label>
                  <Form.Select
                    isInvalid={!!errors.roomType}
                    {...register("roomType")}
                  >
                    <option value="BOARDING_HOUSE">Phòng trọ</option>
                    <option value="WHOLE_HOUSE">Nhà nguyên căn</option>
                    <option value="APARTMENT">Căn hộ</option>
                  </Form.Select>
                  {errors.roomType && (
                    <Form.Control.Feedback type="invalid">
                      {errors.roomType.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Giá thuê (VNĐ)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Nhập giá thuê"
                    isInvalid={!!errors.price}
                    {...register("price", { valueAsNumber: true })}
                  />
                  {errors.price && (
                    <Form.Control.Feedback type="invalid">
                      {errors.price.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Diện tích (m²)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Nhập diện tích"
                    isInvalid={!!errors.area}
                    {...register("area", { valueAsNumber: true })}
                  />
                  {errors.area && (
                    <Form.Control.Feedback type="invalid">
                      {errors.area.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Tiền đặt cọc (VNĐ)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Nhập tiền đặt cọc"
                    isInvalid={!!errors.deposit}
                    {...register("deposit", { valueAsNumber: true })}
                  />
                  {errors.deposit && (
                    <Form.Control.Feedback type="invalid">
                      {errors.deposit.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Tổng số phòng</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Số phòng"
                    isInvalid={!!errors.totalRooms}
                    {...register("totalRooms", { valueAsNumber: true })}
                  />
                  {errors.totalRooms && (
                    <Form.Control.Feedback type="invalid">
                      {errors.totalRooms.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Số người tối đa</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Số người"
                    isInvalid={!!errors.maxPeople}
                    {...register("maxPeople", { valueAsNumber: true })}
                  />
                  {errors.maxPeople && (
                    <Form.Control.Feedback type="invalid">
                      {errors.maxPeople.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Đối tượng cho thuê</Form.Label>
                  <Form.Select
                    isInvalid={!!errors.forGender}
                    {...register("forGender")}
                  >
                    <option value="ALL">Tất cả</option>
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                    <option value="OTHER">Khác</option>
                  </Form.Select>
                  {errors.forGender && (
                    <Form.Control.Feedback type="invalid">
                      {errors.forGender.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Trọ tự quản</Form.Label>
                  <Form.Select
                    isInvalid={!!errors.selfManaged}
                    {...register("selfManaged")}
                  >
                    <option value="false">Không</option>
                    <option value="true">Có</option>
                  </Form.Select>
                  {errors.selfManaged && (
                    <Form.Control.Feedback type="invalid">
                      {errors.selfManaged.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Số phòng khách</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Số phòng khách"
                    isInvalid={!!errors.numberOfLivingRooms}
                    {...register("numberOfLivingRooms", {
                      valueAsNumber: true,
                    })}
                  />
                  {errors.numberOfLivingRooms && (
                    <Form.Control.Feedback type="invalid">
                      {errors.numberOfLivingRooms.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Số phòng ngủ</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Số phòng ngủ"
                    isInvalid={!!errors.numberOfBedrooms}
                    {...register("numberOfBedrooms", { valueAsNumber: true })}
                  />
                  {errors.numberOfBedrooms && (
                    <Form.Control.Feedback type="invalid">
                      {errors.numberOfBedrooms.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Số phòng tắm</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Số phòng tắm"
                    isInvalid={!!errors.numberOfBathrooms}
                    {...register("numberOfBathrooms", { valueAsNumber: true })}
                  />
                  {errors.numberOfBathrooms && (
                    <Form.Control.Feedback type="invalid">
                      {errors.numberOfBathrooms.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Số nhà bếp</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Số nhà bếp"
                    isInvalid={!!errors.numberOfKitchens}
                    {...register("numberOfKitchens", { valueAsNumber: true })}
                  />
                  {errors.numberOfKitchens && (
                    <Form.Control.Feedback type="invalid">
                      {errors.numberOfKitchens.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Mô tả chi tiết về phòng trọ"
                isInvalid={!!errors.description}
                {...register("description")}
              />
              {errors.description && (
                <Form.Control.Feedback type="invalid">
                  {errors.description.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            {/* Address */}
            <h4 className="mb-3">Địa chỉ</h4>
            <Row className="mb-3">
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Tỉnh/Thành phố</Form.Label>
                  <Form.Select
                    value={selectedProvince}
                    onChange={(e) => {
                      setSelectedProvince(e.target.value);
                      setSelectedDistrict("");
                      setSelectedWard("");
                    }}
                    disabled={loading}
                  >
                    <option value="">Chọn Tỉnh/TP...</option>
                    {Array.isArray(provinces) &&
                      provinces.map((province) => (
                        <option key={province.id} value={province.code}>
                          {province.name_with_type}
                        </option>
                      ))}
                  </Form.Select>
                  {errors.address?.province && (
                    <Form.Control.Feedback type="invalid">
                      {errors.address.province.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Quận/Huyện</Form.Label>
                  <Form.Select
                    value={selectedDistrict}
                    onChange={(e) => {
                      setSelectedDistrict(e.target.value);
                      setSelectedWard("");
                    }}
                    disabled={!selectedProvince || loading}
                  >
                    <option value="">Quận/Huyện...</option>
                    {districts.map((district) => (
                      <option key={district.id} value={district.code}>
                        {district.name_with_type}
                      </option>
                    ))}
                  </Form.Select>
                  {errors.address?.district && (
                    <Form.Control.Feedback type="invalid">
                      {errors.address.district.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Phường/Xã</Form.Label>
                  <Form.Select
                    value={selectedWard}
                    onChange={(e) => setSelectedWard(e.target.value)}
                    disabled={!selectedDistrict || loading}
                  >
                    <option value="">Đường phố...</option>
                    {wards.map((ward) => (
                      <option key={ward.id} value={ward.code}>
                        {ward.name_with_type}
                      </option>
                    ))}
                  </Form.Select>
                  {errors.address?.ward && (
                    <Form.Control.Feedback type="invalid">
                      {errors.address.ward.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Đường</Form.Label>
                  <Form.Select
                    isInvalid={!!errors.address?.street}
                    {...register("address.street")}
                  >
                    <option value="">Chọn đường</option>
                    {streets.map((street, index) => (
                      <option key={index} value={street}>
                        {street}
                      </option>
                    ))}
                  </Form.Select>
                  {errors.address?.street && (
                    <Form.Control.Feedback type="invalid">
                      {errors.address.street.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label>Số nhà, địa chỉ cụ thể</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập số nhà, địa chỉ cụ thể"
                isInvalid={!!errors.address?.houseNumber}
                {...register("address.houseNumber")}
              />
              {errors.address?.houseNumber && (
                <Form.Control.Feedback type="invalid">
                  {errors.address.houseNumber.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            {/* Amenities */}
            <h4 className="mb-3">Tiện nghi</h4>
            <Row className="mb-4">
              {amenitiesList.map((amenity) => (
                <Col md={3} key={amenity.id} className="mb-2">
                  <Form.Check
                    type="checkbox"
                    label={amenity.name}
                    id={`amenity-${amenity.id}`}
                    onChange={(e) =>
                      handleCheckboxChange(
                        amenity.id,
                        amenity.name,
                        "amenities",
                        e.target.checked
                      )
                    }
                  />
                </Col>
              ))}
              {errors.amenities && (
                <div className="text-danger">{errors.amenities.message}</div>
              )}
            </Row>

            {/* Target Audiences */}
            <h4 className="mb-3">Đối tượng nhà trọ</h4>
            <Row className="mb-4">
              {targetAudiencesList.map((audience) => (
                <Col md={3} key={audience.id} className="mb-2">
                  <Form.Check
                    type="checkbox"
                    label={audience.name}
                    id={`audience-${audience.id}`}
                    onChange={(e) =>
                      handleCheckboxChange(
                        audience.id,
                        audience.name,
                        "targetAudiences",
                        e.target.checked
                      )
                    }
                  />
                </Col>
              ))}
              {errors.targetAudiences && (
                <div className="text-danger">
                  {errors.targetAudiences.message}
                </div>
              )}
            </Row>

            {/* Surrounding Areas */}
            <h4 className="mb-3">Môi trường xung quanh</h4>
            <Row className="mb-4">
              {surroundingAreasList.map((area) => (
                <Col md={3} key={area.id} className="mb-2">
                  <Form.Check
                    type="checkbox"
                    label={area.name}
                    id={`area-${area.id}`}
                    onChange={(e) =>
                      handleCheckboxChange(
                        area.id,
                        area.name,
                        "surroundingAreas",
                        e.target.checked
                      )
                    }
                  />
                </Col>
              ))}
              {errors.surroundingAreas && (
                <div className="text-danger">
                  {errors.surroundingAreas.message}
                </div>
              )}
            </Row>

            {/* Images */}
            <h4 className="mb-3">Hình ảnh</h4>
            <div className="mb-4">
              <div className="mb-3">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  id="images-input"
                />
                <Button
                  variant="outline-primary"
                  onClick={() =>
                    document.getElementById("images-input")?.click()
                  }
                >
                  Chọn hình ảnh
                </Button>
                <small className="text-muted ms-2">
                  Tối đa 5 hình ảnh, mỗi hình tối đa 5MB
                </small>
              </div>

              {imagePreviews.length > 0 && (
                <Row>
                  {imagePreviews.map((preview, index) => (
                    <Col md={3} key={index} className="position-relative mb-3">
                      <img
                        src={preview}
                        alt={`Preview ${index}`}
                        className="img-thumbnail"
                        style={{
                          width: "100%",
                          height: "150px",
                          objectFit: "cover",
                        }}
                      />
                      <Button
                        variant="danger"
                        size="sm"
                        className="position-absolute"
                        style={{ top: "5px", right: "20px" }}
                        onClick={() => handleRemoveImage(index)}
                      >
                        ×
                      </Button>
                    </Col>
                  ))}
                </Row>
              )}
              {errors.images && (
                <div className="text-danger">{errors.images.message}</div>
              )}
            </div>

            {/* Contact Information */}
            <h4 className="mb-3">Thông tin liên hệ</h4>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tên người liên hệ</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập tên người liên hệ"
                    isInvalid={!!errors.posterName}
                    {...register("posterName")}
                  />
                  {errors.posterName && (
                    <Form.Control.Feedback type="invalid">
                      {errors.posterName.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập số điện thoại"
                    isInvalid={!!errors.posterPhone}
                    {...register("posterPhone")}
                  />
                  {errors.posterPhone && (
                    <Form.Control.Feedback type="invalid">
                      {errors.posterPhone.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-center mt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Đang xử lý...
                  </>
                ) : (
                  "Đăng tin"
                )}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
      {/* Sidebar */}
    </Container>
  );
};

export default RoomPostForm;
