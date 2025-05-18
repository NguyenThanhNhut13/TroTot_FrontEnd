import React, { useState, useEffect, useContext } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { formCreateRoom, FormCreateRoomSchema } from "../../utils/rules";
import { useMutation } from "@tanstack/react-query";
import { AppContext } from "../../contexts/app.context";
import roomApi from "../../apis/room.api";
import mediaAPI from "../../apis/media.api";
import {
  Amenity,
  TargetAudience,
  SurroundingArea,
} from "../../types/room.type";
import Sidebar from "../MainPage/Sidebar";
import { District, Province, Ward } from "../../types/address.type";
import addressAPI from "../../apis/address.api";
import {
  FaCamera,
  FaCloudUploadAlt,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaShower,
  FaBed,
  FaUtensils,
  FaCouch,
  FaUser,
  FaHome,
} from "react-icons/fa";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

type ImageFeedback = {
  url: string;
  feedback: string;
  objectFlags: Record<string, boolean>;
};

const StepOne = () => {
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

  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedWard, setSelectedWard] = useState<string>("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const [imageFeedbacks, setImageFeedbacks] = useState<ImageFeedback[]>([]);
  const [missingSuggestions, setMissingSuggestions] = useState<string>("");

  useEffect(() => {
    cocoSsd.load().then(setModel);
  }, []);

  // Set up form with validation
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormCreateRoomSchema>({
    resolver: yupResolver(formCreateRoom) as Resolver<FormCreateRoomSchema>,
  });

  // Create mutation for room creation
  const createRoomMutation = useMutation({
    mutationFn: (body: FormCreateRoomSchema) => {
      const formData = new FormData();

      // Convert form data to FormData object
      Object.entries(body).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (typeof value === "object" && !Array.isArray(value)) {
            // Handle nested objects like address
            Object.entries(value).forEach(([nestedKey, nestedValue]) => {
              if (nestedValue !== undefined && nestedValue !== null) {
                formData.append(`${key}.${nestedKey}`, String(nestedValue));
              }
            });
          } else if (Array.isArray(value)) {
            // Handle arrays like amenities, targetAudiences, surroundingAreas, images
            formData.append(`${key}`, JSON.stringify(value));
          } else {
            // Handle primitive values
            formData.append(key, String(value));
          }
        }
      });

      return roomApi.createRoom(formData);
    },
    retry: 3, // Số lần retry tối đa
    retryDelay: (attempt) => 3000 + (attempt - 1) * 1000, // 3s, 4s, 5s
    onSuccess: async (data) => {
      console.log("Mutation Success Response:", data);
      toast.success("Đăng tin thành công!");
      navigate("/post-room");
    },
    onError: (error) => {
      console.error("Mutation Error:", error);
      toast.error("Có lỗi xảy ra khi đăng tin. Vui lòng thử lại.");
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    console.log("Form Data Before Submission:", data);
    // Set address values
    data.address.province = selectedProvince;
    data.address.district = selectedDistrict;
    data.address.ward = selectedWard;
    console.log("Address Data:", {
      province: selectedProvince,
      district: selectedDistrict,
      ward: selectedWard,
    });

    // Validate required fields
    if (
      !data.address.province ||
      !data.address.district ||
      !data.address.ward
    ) {
      toast.error("Vui lòng chọn đầy đủ thông tin địa chỉ");
      setLoading(false);
      return;
    }

    // Validate image upload
    if (imageFiles.length === 0) {
      toast.error("Vui lòng tải lên ít nhất một hình ảnh");
      setLoading(false);
      return;
    }

    // Upload images
    const uploadedImages = await uploadImages();
    console.log("Uploaded Images:", uploadedImages);
    if (!uploadedImages || uploadedImages.length === 0) {
      toast.error("Có lỗi xảy ra khi tải hình ảnh. Vui lòng thử lại.");
      setLoading(false);
      return;
    }

    // Set uploaded images to form data
    data.images = uploadedImages;
    console.log("Data with Images:", data);

    // Ensure selfManaged is boolean
    data.selfManaged =
      typeof data.selfManaged === "string"
        ? data.selfManaged === "true"
        : Boolean(data.selfManaged);

    // Submit data
    createRoomMutation.mutate(data, {
      onSuccess: async (data) => {
        console.log("Mutation Success Response:", data);
        toast.success("Đăng tin thành công!");
        navigate("/post-room");
      },
      onError: (error) => {
        console.error("Mutation Error:", error);
        toast.error("Có lỗi xảy ra khi đăng tin. Vui lòng thử lại.");
      },
    });
  });

  // Fetch required data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Try to get data from localStorage first
        const amenitiesLS = localStorage.getItem(`amenities`);
        const targetAudiencesLS = localStorage.getItem(`targetAudiences`);
        const surroundingAreasLS = localStorage.getItem(`surroundingAreas`);
        const provincesLS = localStorage.getItem("provinces");

        // Check if all data is available in localStorage
        if (
          amenitiesLS &&
          targetAudiencesLS &&
          surroundingAreasLS &&
          provincesLS
        ) {
          setAmenitiesList(JSON.parse(amenitiesLS));
          setTargetAudiencesList(JSON.parse(targetAudiencesLS));
          setSurroundingAreasList(JSON.parse(surroundingAreasLS));
          setProvinces(JSON.parse(provincesLS));
          setLoading(false);
          return;
        }

        // Fetch data from API if not available in localStorage
        const [amenitiesRes, audiencesRes, areasRes, provincesRes] =
          await Promise.all([
            roomApi.getAmenities(),
            roomApi.getTargetAudiences(),
            roomApi.getSurroundingAreas(),
            addressAPI.getProvinces(),
          ]);

        if (amenitiesRes.data?.data) {
          setAmenitiesList(amenitiesRes.data.data);
          localStorage.setItem(
            `amenities`,
            JSON.stringify(amenitiesRes.data.data)
          );
        }

        if (audiencesRes.data?.data) {
          setTargetAudiencesList(audiencesRes.data.data);
          localStorage.setItem(
            `targetAudiences`,
            JSON.stringify(audiencesRes.data.data)
          );
        }

        if (areasRes.data?.data) {
          setSurroundingAreasList(areasRes.data.data);
          localStorage.setItem(
            `surroundingAreas`,
            JSON.stringify(areasRes.data.data)
          );
        }

        if (provincesRes.data?.data?.data) {
          setProvinces(provincesRes.data.data.data);
          localStorage.setItem(
            "provinces",
            JSON.stringify(provincesRes.data.data.data)
          );
        }
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

  // Fetch districts when province changes
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!selectedProvince) {
        setDistricts([]);
        return;
      }

      try {
        setLoading(true);
        const response = await addressAPI.getDistricts(selectedProvince);
        if (response.data?.data?.data) {
          setDistricts(response.data.data.data as District[]);
        }
      } catch (error) {
        console.error("Error fetching districts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDistricts();
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
        setLoading(true);
        const response = await addressAPI.getWards(selectedDistrict);
        if (response.data?.data?.data) {
          setWards(response.data.data.data as Ward[]);
        }
      } catch (error) {
        console.error("Error fetching wards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWards();
    setSelectedWard("");
  }, [selectedDistrict]);

  // Handle checkbox changes for amenities, target audiences, surrounding areas
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

  const analyzeImage = (file: File, url: string): Promise<ImageFeedback> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;

      img.onload = async () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const predictions = await model!.detect(img);
        const classes = predictions.map((p) => p.class);

        const objectFlags: Record<string, boolean> = {
          bed: false,
          chair: false,
          table: false,
          tv: false,
          refrigerator: false,
          window: false,
          sink: false,
          toilet: false,
          microwave: false,
          laptop: false,
        };

        classes.forEach((cls) => {
          if (objectFlags.hasOwnProperty(cls)) objectFlags[cls] = true;
        });

        const detected: string[] = [];
        if (objectFlags.bed) detected.push("Giường");
        if (objectFlags.table || objectFlags.chair) detected.push("Bàn/Ghế");
        if (objectFlags.tv) detected.push("TV");
        if (objectFlags.refrigerator) detected.push("Tủ lạnh");
        if (objectFlags.window) detected.push("Cửa sổ");
        if (objectFlags.sink || objectFlags.toilet)
          detected.push("Nhà vệ sinh");
        if (objectFlags.microwave) detected.push("Bếp điện");
        if (objectFlags.laptop) detected.push("Bàn làm việc");

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let totalBrightness = 0;
        for (let i = 0; i < pixels.length; i += 4) {
          totalBrightness += (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
        }
        const avgBrightness = totalBrightness / (pixels.length / 4);

        let feedback = `✅ Vật thể phát hiện: ${
          detected.join(", ") || "Không rõ vật thể chính"
        }.\n`;
        feedback +=
          avgBrightness < 100
            ? "⚠️ Ảnh hơi tối. Nên chụp lại với ánh sáng tốt hơn.\n"
            : "💡 Ảnh đủ sáng.\n";

        resolve({ url, feedback, objectFlags });
      };
    });
  };

  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files || files.length === 0 || !model) return;

    const newFeedbacks: ImageFeedback[] = [];
    const allDetectedFlags: Record<string, boolean> = {
      bed: false,
      chair: false,
      table: false,
      tv: false,
      refrigerator: false,
      window: false,
      sink: false,
      toilet: false,
      microwave: false,
      laptop: false,
    };

    for (const file of files) {
      const url = URL.createObjectURL(file);
      const result = await analyzeImage(file, url);
      newFeedbacks.push(result);

      // Cập nhật cờ tổng hợp
      Object.keys(result.objectFlags).forEach((key) => {
        allDetectedFlags[key] ||= result.objectFlags[key];
      });
    }

    setImageFeedbacks((prev) => [...prev, ...newFeedbacks]);

    const missing: string[] = [];
    if (!allDetectedFlags.window) missing.push("cửa sổ");
    if (!allDetectedFlags.bed) missing.push("giường");
    if (!allDetectedFlags.tv && !allDetectedFlags.refrigerator)
      missing.push("TV hoặc Tủ lạnh");
    if (!allDetectedFlags.sink && !allDetectedFlags.toilet)
      missing.push("hình ảnh nhà vệ sinh");

    if (missing.length > 0) {
      setMissingSuggestions(`📌 Gợi ý bổ sung: ${missing.join(", ")}.`);
    } else {
      setMissingSuggestions("👍 Bộ ảnh đã khá đầy đủ cho việc đăng trọ.");
    }

    // Max 10 images
    const fileArray = Array.from(files).slice(0, 10);

    // Create preview URLs
    const previewUrls = fileArray.map((file) => URL.createObjectURL(file));

    // Update state
    setImageFiles((prevFiles) => [...prevFiles, ...fileArray]);
    setImagePreviews((prevPreviews) => [...prevPreviews, ...previewUrls]);
  };

  // Remove selected image
  const handleRemoveImage = (index: number) => {
    // Remove from preview
    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);

    // Cập nhật lại gợi ý nếu còn ảnh
    const filteredFeedbacks = imageFeedbacks.filter((_, i) => i !== index);
    setImageFeedbacks(filteredFeedbacks);
    if (filteredFeedbacks.length > 0) {
      const combinedFlags: Record<string, boolean> = {
        bed: false,
        chair: false,
        table: false,
        tv: false,
        refrigerator: false,
        window: false,
        sink: false,
        toilet: false,
        microwave: false,
        laptop: false,
      };
      filteredFeedbacks.forEach((item) => {
        Object.keys(item.objectFlags).forEach((key) => {
          combinedFlags[key] ||= item.objectFlags[key];
        });
      });

      const missing: string[] = [];
      if (!combinedFlags.window) missing.push("cửa sổ");
      if (!combinedFlags.bed) missing.push("giường");
      if (!combinedFlags.tv && !combinedFlags.refrigerator) missing.push("TV hoặc Tủ lạnh");
      if (!combinedFlags.sink && !combinedFlags.toilet) missing.push("hình ảnh nhà vệ sinh");

      if (missing.length > 0) {
        setMissingSuggestions(`📌 Gợi ý bổ sung: ${missing.join(", ")}.`);
      } else {
        setMissingSuggestions("👍 Bộ ảnh đã khá đầy đủ cho việc đăng trọ.");
      }
    } else {
      setMissingSuggestions("");
    }

    // Remove from files
    const newFiles = [...imageFiles];
    newFiles.splice(index, 1);

    setImagePreviews(newPreviews);
    setImageFiles(newFiles);
  };

  // Upload images
  const uploadImages = async () => {
    if (imageFiles.length === 0) return [];

    try {
      let uploadedImages;
      if (imageFiles.length === 1) {
        // Upload single file
        const response = await mediaAPI.uploadFile(imageFiles[0]);
        console.log("Single Image Upload Response:", response);
        const mediaItem = response.data.data;
        uploadedImages = [
          {
            publicId: mediaItem.publicId,
            imageUrl: mediaItem.imageUrl,
          },
        ];
      } else {
        // Upload multiple files
        const response = await mediaAPI.uploadFiles(imageFiles);
        console.log("Multiple Images Upload Response:", response);
        uploadedImages = response.data.data.map((media) => ({
          publicId: media.publicId,
          imageUrl: media.imageUrl,
        }));
      }
      return uploadedImages;
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Không thể tải lên hình ảnh. Vui lòng thử lại.");
      throw error;
    }
  };

  // Form submission handler

  if (loading && !amenitiesList.length) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <Container fluid>
        <Row>
          {/* Left Sidebar */}
          <Col
            md={4}
            lg={2}
            className="px-0 position-fixed bg-white shadow-sm"
            style={{ minWidth: "320px", left: "88px" }}
          >
            <Sidebar />
          </Col>

          {/* Main Content */}
          <Col
            md={8}
            lg={10}
            className="ms-auto position-relative"
            style={{ right: "-86px" }}
          >
            <div className="mb-4">
              <h2 className="mb-1">Đăng tin mới</h2>
              <p className="text-muted">
                Điền đầy đủ thông tin để đăng tin cho thuê phòng trọ
              </p>
            </div>

            <Form onSubmit={onSubmit} noValidate>
              {/* Basic Information Card */}
              <Card className="mb-4 shadow-sm">
                <Card.Header className="bg-primary text-white py-3">
                  <h5 className="mb-0 d-flex align-items-center">
                    <FaInfoCircle className="me-2" /> Thông tin cơ bản
                  </h5>
                </Card.Header>
                <Card.Body className="p-4">
                  <Row className="mb-3">
                    <Col md={8}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Tiêu đề</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Nhập tiêu đề tin đăng"
                          className={errors.title ? "is-invalid" : ""}
                          {...register("title")}
                        />
                        {errors.title && (
                          <div className="invalid-feedback">
                            {errors.title.message}
                          </div>
                        )}
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Loại phòng</Form.Label>
                        <Form.Select
                          className={errors.roomType ? "is-invalid" : ""}
                          {...register("roomType")}
                        >
                          <option value="BOARDING_HOUSE">Phòng trọ</option>
                          <option value="WHOLE_HOUSE">Nhà nguyên căn</option>
                          <option value="APARTMENT">Căn hộ</option>
                        </Form.Select>
                        {errors.roomType && (
                          <div className="invalid-feedback">
                            {errors.roomType.message}
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-4">
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          Giá thuê (VNĐ/tháng)
                        </Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Nhập giá thuê"
                          className={errors.price ? "is-invalid" : ""}
                          {...register("price", { valueAsNumber: true })}
                        />
                        {errors.price && (
                          <div className="invalid-feedback">
                            {errors.price.message}
                          </div>
                        )}
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          Diện tích (m²)
                        </Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Nhập diện tích"
                          className={errors.area ? "is-invalid" : ""}
                          {...register("area", { valueAsNumber: true })}
                        />
                        {errors.area && (
                          <div className="invalid-feedback">
                            {errors.area.message}
                          </div>
                        )}
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          Đặt cọc (VNĐ)
                        </Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Nhập số tiền đặt cọc"
                          className={errors.deposit ? "is-invalid" : ""}
                          {...register("deposit", { valueAsNumber: true })}
                        />
                        {errors.deposit && (
                          <div className="invalid-feedback">
                            {errors.deposit.message}
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Mô tả chi tiết</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      placeholder="Mô tả chi tiết về phòng trọ, tiện ích, điều kiện, quy định..."
                      className={errors.description ? "is-invalid" : ""}
                      {...register("description")}
                    />
                    {errors.description && (
                      <div className="invalid-feedback">
                        {errors.description.message}
                      </div>
                    )}
                    <Form.Text className="text-muted">
                      Mô tả càng chi tiết, cơ hội tìm được người thuê càng cao
                    </Form.Text>
                  </Form.Group>
                </Card.Body>
              </Card>

              {/* Room Details Card */}
              <Card className="mb-4 shadow-sm">
                <Card.Header className="bg-primary text-white py-3">
                  <h5 className="mb-0 d-flex align-items-center">
                    <FaHome className="me-2" /> Thông tin phòng
                  </h5>
                </Card.Header>
                <Card.Body className="p-4">
                  <Row className="mb-4">
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          Tổng số phòng
                        </Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Nhập số phòng"
                          className={errors.totalRooms ? "is-invalid" : ""}
                          {...register("totalRooms", { valueAsNumber: true })}
                        />
                        {errors.totalRooms && (
                          <div className="invalid-feedback">
                            {errors.totalRooms.message}
                          </div>
                        )}
                      </Form.Group>
                    </Col>

                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          Số người tối đa
                        </Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Nhập số người ở tối đa"
                          className={errors.maxPeople ? "is-invalid" : ""}
                          {...register("maxPeople", { valueAsNumber: true })}
                        />
                        {errors.maxPeople && (
                          <div className="invalid-feedback">
                            {errors.maxPeople.message}
                          </div>
                        )}
                      </Form.Group>
                    </Col>

                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          Đối tượng thuê
                        </Form.Label>
                        <Form.Select
                          className={errors.forGender ? "is-invalid" : ""}
                          {...register("forGender")}
                        >
                          <option value="ALL">Tất cả</option>
                          <option value="MALE">Nam</option>
                          <option value="FEMALE">Nữ</option>
                        </Form.Select>
                        {errors.forGender && (
                          <div className="invalid-feedback">
                            {errors.forGender.message}
                          </div>
                        )}
                      </Form.Group>
                    </Col>

                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          Chủ trọ quản lý
                        </Form.Label>
                        <Form.Select
                          className={errors.selfManaged ? "is-invalid" : ""}
                          {...register("selfManaged")}
                        >
                          <option value="false">Không</option>
                          <option value="true">Có</option>
                        </Form.Select>
                        {errors.selfManaged && (
                          <div className="invalid-feedback">
                            {errors.selfManaged.message}
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold d-flex align-items-center">
                          <FaCouch className="me-2 text-primary" /> Phòng khách
                        </Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Số phòng khách"
                          className={
                            errors.numberOfLivingRooms ? "is-invalid" : ""
                          }
                          {...register("numberOfLivingRooms", {
                            valueAsNumber: true,
                          })}
                        />
                        {errors.numberOfLivingRooms && (
                          <div className="invalid-feedback">
                            {errors.numberOfLivingRooms.message}
                          </div>
                        )}
                      </Form.Group>
                    </Col>

                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold d-flex align-items-center">
                          <FaBed className="me-2 text-primary" /> Phòng ngủ
                        </Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Số phòng ngủ"
                          className={
                            errors.numberOfBedrooms ? "is-invalid" : ""
                          }
                          {...register("numberOfBedrooms", {
                            valueAsNumber: true,
                          })}
                        />
                        {errors.numberOfBedrooms && (
                          <div className="invalid-feedback">
                            {errors.numberOfBedrooms.message}
                          </div>
                        )}
                      </Form.Group>
                    </Col>

                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold d-flex align-items-center">
                          <FaShower className="me-2 text-primary" /> Phòng tắm
                        </Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Số phòng tắm"
                          className={
                            errors.numberOfBathrooms ? "is-invalid" : ""
                          }
                          {...register("numberOfBathrooms", {
                            valueAsNumber: true,
                          })}
                        />
                        {errors.numberOfBathrooms && (
                          <div className="invalid-feedback">
                            {errors.numberOfBathrooms.message}
                          </div>
                        )}
                      </Form.Group>
                    </Col>

                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold d-flex align-items-center">
                          <FaUtensils className="me-2 text-primary" /> Nhà bếp
                        </Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Số nhà bếp"
                          className={
                            errors.numberOfKitchens ? "is-invalid" : ""
                          }
                          {...register("numberOfKitchens", {
                            valueAsNumber: true,
                          })}
                        />
                        {errors.numberOfKitchens && (
                          <div className="invalid-feedback">
                            {errors.numberOfKitchens.message}
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Address Card */}
              <Card className="mb-4 shadow-sm">
                <Card.Header className="bg-primary text-white py-3">
                  <h5 className="mb-0 d-flex align-items-center">
                    <FaMapMarkerAlt className="me-2" /> Địa chỉ cho thuê
                  </h5>
                </Card.Header>
                <Card.Body className="p-4">
                  <Row className="mb-3">
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          Tỉnh/Thành phố
                        </Form.Label>
                        <Form.Select
                          value={selectedProvince}
                          onChange={(e) => setSelectedProvince(e.target.value)}
                          className={
                            !selectedProvince && errors.address?.province
                              ? "is-invalid"
                              : ""
                          }
                        >
                          <option value="">Chọn Tỉnh/Thành phố</option>
                          {provinces.map((province) => (
                            <option key={province.code} value={province.code}>
                              {province.name_with_type}
                            </option>
                          ))}
                        </Form.Select>
                        {!selectedProvince && errors.address?.province && (
                          <div className="invalid-feedback">
                            {errors.address.province.message}
                          </div>
                        )}
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Quận/Huyện</Form.Label>
                        <Form.Select
                          value={selectedDistrict}
                          onChange={(e) => setSelectedDistrict(e.target.value)}
                          disabled={!selectedProvince}
                          className={
                            selectedProvince &&
                            !selectedDistrict &&
                            errors.address?.district
                              ? "is-invalid"
                              : ""
                          }
                        >
                          <option value="">Chọn Quận/Huyện</option>
                          {districts.map((district) => (
                            <option key={district.code} value={district.code}>
                              {district.name_with_type}
                            </option>
                          ))}
                        </Form.Select>
                        {selectedProvince &&
                          !selectedDistrict &&
                          errors.address?.district && (
                            <div className="invalid-feedback">
                              {errors.address.district.message}
                            </div>
                          )}
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Phường/Xã</Form.Label>
                        <Form.Select
                          value={selectedWard}
                          onChange={(e) => setSelectedWard(e.target.value)}
                          disabled={!selectedDistrict}
                          className={
                            selectedDistrict &&
                            !selectedWard &&
                            errors.address?.ward
                              ? "is-invalid"
                              : ""
                          }
                        >
                          <option value="">Chọn Phường/Xã</option>
                          {wards.map((ward) => (
                            <option key={ward.code} value={ward.code}>
                              {ward.name_with_type}
                            </option>
                          ))}
                        </Form.Select>
                        {selectedDistrict &&
                          !selectedWard &&
                          errors.address?.ward && (
                            <div className="invalid-feedback">
                              {errors.address.ward.message}
                            </div>
                          )}
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Đường/Phố</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Nhập tên đường/phố"
                          className={errors.address?.street ? "is-invalid" : ""}
                          {...register("address.street")}
                        />
                        {errors.address?.street && (
                          <div className="invalid-feedback">
                            {errors.address.street.message}
                          </div>
                        )}
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Số nhà</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Nhập số nhà"
                          className={
                            errors.address?.houseNumber ? "is-invalid" : ""
                          }
                          {...register("address.houseNumber")}
                        />
                        {errors.address?.houseNumber && (
                          <div className="invalid-feedback">
                            {errors.address.houseNumber.message}
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Amenities Card */}
              <Card className="mb-4 shadow-sm">
                <Card.Header className="bg-primary text-white py-3">
                  <h5 className="mb-0">Tiện ích</h5>
                </Card.Header>
                <Card.Body className="p-4">
                  <p className="text-muted mb-3">
                    Chọn tiện ích có sẵn tại phòng trọ
                  </p>
                  <Row>
                    {amenitiesList.map((amenity) => (
                      <Col
                        xs={6}
                        md={4}
                        lg={3}
                        key={amenity.id}
                        className="mb-2"
                      >
                        <Form.Check
                          type="checkbox"
                          id={`amenity-${amenity.id}`}
                          label={amenity.name}
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
                  </Row>
                </Card.Body>
              </Card>

              {/* Target Audiences Card */}
              <Card className="mb-4 shadow-sm">
                <Card.Header className="bg-primary text-white py-3">
                  <h5 className="mb-0">Đối tượng phù hợp</h5>
                </Card.Header>
                <Card.Body className="p-4">
                  <p className="text-muted mb-3">
                    Chọn đối tượng phù hợp để thuê phòng của bạn
                  </p>
                  <Row>
                    {targetAudiencesList.map((audience) => (
                      <Col
                        xs={6}
                        md={4}
                        lg={3}
                        key={audience.id}
                        className="mb-2"
                      >
                        <Form.Check
                          type="checkbox"
                          id={`audience-${audience.id}`}
                          label={audience.name}
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
                  </Row>
                </Card.Body>
              </Card>

              {/* Surrounding Areas Card */}
              <Card className="mb-4 shadow-sm">
                <Card.Header className="bg-primary text-white py-3">
                  <h5 className="mb-0">Khu vực xung quanh</h5>
                </Card.Header>
                <Card.Body className="p-4">
                  <p className="text-muted mb-3">
                    Chọn các địa điểm gần phòng trọ của bạn
                  </p>
                  <Row>
                    {surroundingAreasList.map((area) => (
                      <Col xs={6} md={4} lg={3} key={area.id} className="mb-2">
                        <Form.Check
                          type="checkbox"
                          id={`area-${area.id}`}
                          label={area.name}
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
                  </Row>
                </Card.Body>
              </Card>

              {/* Images Card */}
              <Card className="mb-4 shadow-sm">
                <Card.Header className="bg-primary text-white py-3">
                  <h5 className="mb-0 d-flex align-items-center">
                    <FaCamera className="me-2" /> Hình ảnh
                  </h5>
                </Card.Header>
                <Card.Body className="p-4">
                  <p className="text-muted mb-3">
                    Thêm hình ảnh giúp người thuê dễ dàng tìm thấy phòng của
                    bạn. Đăng tối đa 10 ảnh.
                  </p>

                  <div className="mb-4">
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
                      className="mb-3 d-flex align-items-center"
                      onClick={() =>
                        document.getElementById("images-input")?.click()
                      }
                    >
                      <FaCloudUploadAlt className="me-2" size={20} /> Tải ảnh
                      lên
                    </Button>

                    {errors.images && (
                      <div className="text-danger mb-3">
                        {errors.images.message}
                      </div>
                    )}

                    {imagePreviews.length > 0 && (
                      <div>
                        <p className="mb-2 fw-bold">
                          Ảnh đã chọn ({imagePreviews.length}/10):
                        </p>
                        <Row className="g-2">
                          {imagePreviews.map((preview, index) => (
                            <Col xs={6} md={3} lg={2} key={index}>
                              <div className="position-relative">
                                <img
                                  src={preview}
                                  alt={`Preview ${index + 1}`}
                                  className="img-thumbnail"
                                  style={{
                                    width: "100%",
                                    height: "120px",
                                    objectFit: "cover",
                                  }}
                                />
                                <Button
                                  variant="danger"
                                  size="sm"
                                  className="position-absolute top-0 end-0"
                                  style={{ padding: "0.15rem 0.4rem" }}
                                  onClick={() => handleRemoveImage(index)}
                                >
                                  ×
                                </Button>
                              </div>
                            </Col>
                          ))}
                        </Row>
                      </div>
                    )}

                    {imageFeedbacks.length > 0 && (
                      <div
                        style={{
                          marginTop: 20,
                          background: "#f0f0f0",
                          padding: 10,
                          borderRadius: 6,
                        }}
                      >
                        <strong>{missingSuggestions}</strong>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>

              {/* Contact Information Card */}
              <Card className="mb-4 shadow-sm">
                <Card.Header className="bg-primary text-white py-3">
                  <h5 className="mb-0 d-flex align-items-center">
                    <FaUser className="me-2" /> Thông tin liên hệ
                  </h5>
                </Card.Header>
                <Card.Body className="p-4">
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          Tên người liên hệ
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Nhập tên người liên hệ"
                          value={profile?.fullName}
                          className={errors.posterName ? "is-invalid" : ""}
                          {...register("posterName")}
                        />
                        {errors.posterName && (
                          <div className="invalid-feedback">
                            {errors.posterName.message}
                          </div>
                        )}
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          Số điện thoại
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Nhập số điện thoại"
                          className={errors.posterPhone ? "is-invalid" : ""}
                          {...register("posterPhone")}
                        />
                        {errors.posterPhone && (
                          <div className="invalid-feedback">
                            {errors.posterPhone.message}
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Submit Button */}
              <div className="d-flex justify-content-center mb-5">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="px-5 py-3"
                  disabled={loading || isSubmitting}
                >
                  {loading || isSubmitting ? (
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
      </Container>
    </div>
  );
};

export default StepOne;
