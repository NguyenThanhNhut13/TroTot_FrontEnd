import React, { useState, useEffect, ChangeEvent,useContext } from "react";
import { Form, Button, Row, Col, Tabs, Tab } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../MainPage/Sidebar";
import roomApi from "../../apis/room.api.";
import { Amenity, TargetAudience, SurroundingArea } from "../../types/room.type";
import "../../assets/styles/PostRoom.css"; 
import { AppContext } from "../../contexts/app.context";


// Define interface for form data
interface FormData {
  title: string;
  selfManaged: string;
  area: string;
  price: string;
  totalRooms: string;
  description: string;
  targetAudiences: number[];
  amenities: number[];
  surroundingAreas: number[];
  province: string;
  district: string;
  ward: string;
  street: string;
  detailedAddress: string;
  images: File[];
  posterName: string;
  posterPhone: string;
  maxPeople: string;
  forGender: "ALL" | "MALE" | "FEMALE";
  deposit: string;
  numberOfLivingRooms: string;
  numberOfKitchens: string;
  numberOfBathrooms: string;
  numberOfBedrooms: string;
}

// Define interface for errors
interface Errors {
  title?: string;
  selfManaged?: string;
  area?: string;
  price?: string;
  totalRooms?: string;
  description?: string;
  targetAudiences?: string;
  amenities?: string;
  surroundingAreas?: string;
  province?: string;
  district?: string;
  ward?: string;
  street?: string;
  detailedAddress?: string;
  images?: string;
  posterName?: string;
  posterPhone?: string;
  maxPeople?: string;
  forGender?: string;
  deposit?: string;
  numberOfLivingRooms?: string;
  numberOfKitchens?: string;
  numberOfBathrooms?: string;
  numberOfBedrooms?: string;
}

const RoomPostForm = () => {
  const navigate = useNavigate();
  const { type } = useParams<{ type: string }>();
  const [currentTab, setCurrentTab] = useState("general");
  const { profile } = useContext(AppContext);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    selfManaged: "",
    area: "",
    price: "",
    totalRooms: "",
    description: "",
    targetAudiences: [],
    amenities: [],
    surroundingAreas: [],
    province: "",
    district: "",
    ward: "",
    street: "",
    detailedAddress: "",
    images: [],
    posterName: "",
    posterPhone: "",
    maxPeople: "",
    forGender: "ALL",
    deposit: "",
    numberOfLivingRooms: "",
    numberOfKitchens: "",
    numberOfBathrooms: "",
    numberOfBedrooms: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amenitiesList, setAmenitiesList] = useState<Amenity[]>([]);
  const [targetAudiencesList, setTargetAudiencesList] = useState<TargetAudience[]>([]);
  const [surroundingAreasList, setSurroundingAreasList] = useState<SurroundingArea[]>([]);
  const [provinces, setProvinces] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [wards, setWards] = useState<string[]>([]);
  const [streets, setStreets] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Fetch dữ liệu động khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const amenitiesRes = await roomApi.getAmenities();
        setAmenitiesList(amenitiesRes.data.data);
        console.log("Amenities:", amenitiesRes.data.data);

        const targetAudiencesRes = await roomApi.getTargetAudiences();
        setTargetAudiencesList(targetAudiencesRes.data.data);
        console.log("Target Audiences:", targetAudiencesRes.data.data);

        const surroundingAreasRes = await roomApi.getSurroundingAreas();
        setSurroundingAreasList(surroundingAreasRes.data.data);
        console.log("Surrounding Areas:", surroundingAreasRes.data.data);

        setProvinces(["Chọn Tỉnh/TP...", "Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng"]);
        setDistricts(["Quận/Huyện...", "Quận 1", "Quận 7", "Quận Ba Đình"]);
        setWards(["Phường/Xã...", "Phường Bến Nghé", "Phường Tân Phú", "Phường Cống Vị"]);
        setStreets(["Đường phố...", "Đường Lê Lợi", "Đường Nguyễn Huệ", "Đường Điện Biên Phủ"]);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Không thể tải dữ liệu, vui lòng thử lại!");
      }
    };

    fetchData();

    // Dọn dẹp URL preview khi component unmount
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (
    e: ChangeEvent<HTMLInputElement>,
    type: "targetAudiences" | "amenities" | "surroundingAreas"
  ) => {
    const { name, checked } = e.target;
    const id = parseInt(name);
    if (type === "targetAudiences") {
      setFormData((prev) => ({
        ...prev,
        targetAudiences: checked
          ? [...prev.targetAudiences, id]
          : prev.targetAudiences.filter((item) => item !== id),
      }));
    } else if (type === "amenities") {
      setFormData((prev) => ({
        ...prev,
        amenities: checked
          ? [...prev.amenities, id]
          : prev.amenities.filter((item) => item !== id),
      }));
    } else if (type === "surroundingAreas") {
      setFormData((prev) => ({
        ...prev,
        surroundingAreas: checked
          ? [...prev.surroundingAreas, id]
          : prev.surroundingAreas.filter((item) => item !== id),
      }));
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const previewUrls = fileArray.map((file) => URL.createObjectURL(file));
      
      setFormData((prev) => ({
        ...prev,
        images: fileArray,
      }));
      
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
      setImagePreviews(previewUrls);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    
    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    
    setFormData((prev) => ({
      ...prev,
      images: newImages,
    }));
    setImagePreviews(newPreviews);
  };

  const validateForm = () => {
    const newErrors: Errors = {};

    if (!formData.title) newErrors.title = "Vui lòng nhập tên nhà trọ";
    if (!formData.selfManaged) newErrors.selfManaged = "Vui lòng chọn trọ tự quản";
    if (!formData.area || isNaN(Number(formData.area)) || Number(formData.area) <= 0)
      newErrors.area = "Diện tích phải là số dương";
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0)
      newErrors.price = "Giá cho thuê phải là số dương";
    if (!formData.totalRooms || isNaN(Number(formData.totalRooms)) || Number(formData.totalRooms) <= 0)
      newErrors.totalRooms = "Tổng số phòng phải là số dương";
    if (!formData.description || formData.description.length < 10)
      newErrors.description = "Mô tả phải ít nhất 10 ký tự";
    if (!formData.province || formData.province === "Chọn Tỉnh/TP...")
      newErrors.province = "Vui lòng chọn Tỉnh/TP";
    if (!formData.district || formData.district === "Quận/Huyện...")
      newErrors.district = "Vui lòng chọn Quận/Huyện";
    if (!formData.ward || formData.ward === "Phường/Xã...")
      newErrors.ward = "Vui lòng chọn Phường/Xã";
    if (!formData.street || formData.street === "Đường phố...")
      newErrors.street = "Vui lòng chọn Đường phố";
    if (!formData.detailedAddress)
      newErrors.detailedAddress = "Vui lòng nhập địa chỉ chi tiết";
    if (!formData.posterName) newErrors.posterName = "Vui lòng nhập họ tên liên hệ";
    if (!formData.posterPhone) {
      newErrors.posterPhone = "Vui lòng nhập số điện thoại";
    } else if (!/^\d{10}$/.test(formData.posterPhone)) {
      newErrors.posterPhone = "Số điện thoại phải có đúng 10 chữ số";
    }
    if (!formData.maxPeople || isNaN(Number(formData.maxPeople)) || Number(formData.maxPeople) <= 0)
      newErrors.maxPeople = "Số người tối đa phải là số dương";
    if (!formData.forGender) newErrors.forGender = "Vui lòng chọn đối tượng cho thuê";
    if (!formData.deposit || isNaN(Number(formData.deposit)) || Number(formData.deposit) < 0)
      newErrors.deposit = "Tiền đặt cọc phải là số không âm";
    if (!formData.numberOfLivingRooms || isNaN(Number(formData.numberOfLivingRooms)) || Number(formData.numberOfLivingRooms) < 0)
      newErrors.numberOfLivingRooms = "Số phòng khách phải là số không âm";
    if (!formData.numberOfKitchens || isNaN(Number(formData.numberOfKitchens)) || Number(formData.numberOfKitchens) < 0)
      newErrors.numberOfKitchens = "Số nhà bếp phải là số không âm";
    if (!formData.numberOfBathrooms || isNaN(Number(formData.numberOfBathrooms)) || Number(formData.numberOfBathrooms) < 0)
      newErrors.numberOfBathrooms = "Số phòng tắm phải là số không âm";
    if (!formData.numberOfBedrooms || isNaN(Number(formData.numberOfBedrooms)) || Number(formData.numberOfBedrooms) < 0)
      newErrors.numberOfBedrooms = "Số phòng ngủ phải là số không âm";
    if (formData.targetAudiences.length === 0)
      newErrors.targetAudiences = "Vui lòng chọn ít nhất một đối tượng nhà trọ";
    if (formData.amenities.length === 0)
      newErrors.amenities = "Vui lòng chọn ít nhất một tiện nghi";
    if (formData.surroundingAreas.length === 0)
      newErrors.surroundingAreas = "Vui lòng chọn ít nhất một môi trường xung quanh";
    if (formData.images.length === 0) {
      newErrors.images = "Vui lòng tải lên ít nhất một hình ảnh";
    } else if (formData.images.length > 5) {
      newErrors.images = "Chỉ được tải lên tối đa 5 hình ảnh";
    } else {
      const maxSize = 5 * 1024 * 1024; // 5MB
      for (const file of formData.images) {
        if (file.size > maxSize) {
          newErrors.images = "Mỗi hình ảnh không được lớn hơn 5MB";
          break;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      title: "",
      selfManaged: "",
      area: "",
      price: "",
      totalRooms: "",
      description: "",
      targetAudiences: [],
      amenities: [],
      surroundingAreas: [],
      province: "",
      district: "",
      ward: "",
      street: "",
      detailedAddress: "",
      images: [],
      posterName: "",
      posterPhone: "",
      maxPeople: "",
      forGender: "ALL",
      deposit: "",
      numberOfLivingRooms: "",
      numberOfKitchens: "",
      numberOfBathrooms: "",
      numberOfBedrooms: "",
    });
    setErrors({});
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setImagePreviews([]);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Tạo FormData để gửi dữ liệu
      const formDataToSend = new FormData();
      
      // Thêm các trường dữ liệu
      formDataToSend.append("title", formData.title);
      formDataToSend.append("selfManaged", formData.selfManaged);
      formDataToSend.append("area", formData.area);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("totalRooms", formData.totalRooms);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("province", formData.province);
      formDataToSend.append("district", formData.district);
      formDataToSend.append("ward", formData.ward);
      formDataToSend.append("street", formData.street);
      formDataToSend.append("detailedAddress", formData.detailedAddress);
      formDataToSend.append("posterName", formData.posterName);
      formDataToSend.append("posterPhone", formData.posterPhone);
      formDataToSend.append("maxPeople", formData.maxPeople);
      formDataToSend.append("forGender", formData.forGender);
      formDataToSend.append("deposit", formData.deposit);
      formDataToSend.append("numberOfLivingRooms", formData.numberOfLivingRooms);
      formDataToSend.append("numberOfKitchens", formData.numberOfKitchens);
      formDataToSend.append("numberOfBathrooms", formData.numberOfBathrooms);
      formDataToSend.append("numberOfBedrooms", formData.numberOfBedrooms);
      
      // Thêm mảng targetAudiences, amenities, surroundingAreas dưới dạng JSON string
      formDataToSend.append("targetAudiences", JSON.stringify(formData.targetAudiences));
      formDataToSend.append("amenities", JSON.stringify(formData.amenities));
      formDataToSend.append("surroundingAreas", JSON.stringify(formData.surroundingAreas));
      
      // Thêm hình ảnh
      formData.images.forEach((image, index) => {
        formDataToSend.append("images", image);
      });

      // Gọi API để tạo phòng
      const response = await roomApi.createRoom(formDataToSend);

      // Xử lý phản hồi từ API
      if (response.data.success) {
        toast.success("Đăng tin phòng trọ thành công!", {
          position: "top-right",
          autoClose: 3000,
        });
        resetForm(); // Reset form sau khi tạo thành công
        navigate("/post-room"); // Chuyển hướng về trang danh sách bài đăng
      } else {
        toast.error("Đăng tin thất bại, vui lòng thử lại!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error: any) {
      console.error("Error creating room:", error);
      if (error.response?.status === 401) {
        toast.error("Vui lòng đăng nhập để đăng tin!", {
          position: "top-right",
          autoClose: 3000,
        });
        navigate("/");
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="main-content" style={{ display: "flex" }}>
      <div className="sidebar-container" style={{ width: "30%" }}>
        <Sidebar />
      </div>

      <div className="content" style={{ flex: 1, padding: "20px" }}>
        <Tabs
          activeKey={currentTab}
          onSelect={(k) => setCurrentTab(k || "")}
          className="mb-4"
        >
          <Tab eventKey="general" title="Thông tin chung"></Tab>
        </Tabs>

        <h4 className="mb-3" style={{ color: "blue" }}>
          THÔNG TIN CHUNG
        </h4>
        <h5>Tên nhà trọ, phòng trọ</h5>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Nhập tên nhà trọ"
            isInvalid={!!errors.title}
            style={{ width: "100%", height: "40px" }}
          />
          <Form.Control.Feedback type="invalid">
            {errors.title}
          </Form.Control.Feedback>
        </Form.Group>

        <Form>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <h5>Trọ tự quản</h5>
                <Form.Select
                  name="selfManaged"
                  value={formData.selfManaged}
                  onChange={handleInputChange}
                  isInvalid={!!errors.selfManaged}
                  style={{ width: "100%", height: "40px" }}
                >
                  <option value="">Lựa chọn</option>
                  <option value="1">Có</option>
                  <option value="0">Không</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.selfManaged}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <h5>Diện tích</h5>
                <div className="d-flex align-items-center">
                  <Form.Control
                    type="number"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    placeholder="Diện tích"
                    isInvalid={!!errors.area}
                    style={{ width: "100%", height: "40px" }}
                  />
                  <Button
                    variant="outline-primary"
                    className="ms-2"
                    style={{ height: "40px", width: "60px" }}
                  >
                    m²
                  </Button>
                </div>
                <Form.Control.Feedback type="invalid">
                  {errors.area}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <h5>Giá cho thuê</h5>
                <div className="d-flex align-items-center">
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Giá cho thuê"
                    isInvalid={!!errors.price}
                    style={{ width: "100%", height: "40px" }}
                  />
                </div>
                <div
                  className="mt-2 d-flex gap-2 flex-wrap"
                  style={{ justifyContent: "space-between" }}
                >
                  {[100000, 1000000, 10000000, 100000000].map((price) => (
                    <Button
                      key={price}
                      variant="outline-primary"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          price: price.toString(),
                        })
                      }
                      style={{
                        width: "100px",
                        height: "40px",
                        textAlign: "center",
                        padding: "0",
                        fontSize: "14px",
                      }}
                    >
                      {price.toLocaleString()}
                    </Button>
                  ))}
                </div>
                <Form.Control.Feedback type="invalid">
                  {errors.price}
                </Form.Control.Feedback>
                <div className="mt-2">
                  <span>Tổng trị giá: </span>
                  <span className="fw-bold">
                    {formData.price
                      ? Number(formData.price).toLocaleString() + " đ"
                      : "0 đ"}
                  </span>
                </div>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <h5>Tổng số phòng</h5>
                <Form.Control
                  type="number"
                  name="totalRooms"
                  value={formData.totalRooms}
                  onChange={handleInputChange}
                  placeholder="Tổng số phòng"
                  isInvalid={!!errors.totalRooms}
                  style={{ width: "100%", height: "40px" }}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.totalRooms}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <h5>Số người tối đa</h5>
                <Form.Control
                  type="number"
                  name="maxPeople"
                  value={formData.maxPeople}
                  onChange={handleInputChange}
                  placeholder="Số người tối đa"
                  isInvalid={!!errors.maxPeople}
                  style={{ width: "100%", height: "40px" }}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.maxPeople}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <h5>Đối tượng cho thuê</h5>
                <Form.Select
                  name="forGender"
                  value={formData.forGender}
                  onChange={handleInputChange}
                  isInvalid={!!errors.forGender}
                  style={{ width: "100%", height: "40px" }}
                >
                  <option value="ALL">Tất cả</option>
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.forGender}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <h5>Tiền đặt cọc</h5>
                <Form.Control
                  type="number"
                  name="deposit"
                  value={formData.deposit}
                  onChange={handleInputChange}
                  placeholder="Tiền đặt cọc"
                  isInvalid={!!errors.deposit}
                  style={{ width: "100%", height: "40px" }}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.deposit}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={3}>
              <Form.Group>
                <h5>Số phòng khách</h5>
                <Form.Control
                  type="number"
                  name="numberOfLivingRooms"
                  value={formData.numberOfLivingRooms}
                  onChange={handleInputChange}
                  placeholder="Số phòng khách"
                  isInvalid={!!errors.numberOfLivingRooms}
                  style={{ width: "100%", height: "40px" }}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.numberOfLivingRooms}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <h5>Số nhà bếp</h5>
                <Form.Control
                  type="number"
                  name="numberOfKitchens"
                  value={formData.numberOfKitchens}
                  onChange={handleInputChange}
                  placeholder="Số nhà bếp"
                  isInvalid={!!errors.numberOfKitchens}
                  style={{ width: "100%", height: "40px" }}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.numberOfKitchens}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <h5>Số phòng tắm</h5>
                <Form.Control
                  type="number"
                  name="numberOfBathrooms"
                  value={formData.numberOfBathrooms}
                  onChange={handleInputChange}
                  placeholder="Số phòng tắm"
                  isInvalid={!!errors.numberOfBathrooms}
                  style={{ width: "100%", height: "40px" }}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.numberOfBathrooms}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <h5>Số phòng ngủ</h5>
                <Form.Control
                  type="number"
                  name="numberOfBedrooms"
                  value={formData.numberOfBedrooms}
                  onChange={handleInputChange}
                  placeholder="Số phòng ngủ"
                  isInvalid={!!errors.numberOfBedrooms}
                  style={{ width: "100%", height: "40px" }}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.numberOfBedrooms}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <h5>Nội dung mô tả</h5>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Nội dung mô tả"
              isInvalid={!!errors.description}
              style={{ width: "100%", minHeight: "100px" }}
            />
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="mb-3">
            <h5 className="mb-3" style={{ color: "blue" }}>
              ĐỐI TƯỢNG NHÀ TRỌ
            </h5>
            <div className="d-flex gap-2 flex-wrap">
              {targetAudiencesList.map((target) => (
                <Form.Check
                  key={target.id}
                  inline
                  label={target.name}
                  name={target.id.toString()}
                  type="checkbox"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleCheckboxChange(e, "targetAudiences")
                  }
                />
              ))}
            </div>
            {errors.targetAudiences && (
              <div className="text-danger mt-2">{errors.targetAudiences}</div>
            )}
          </div>

          <div className="mb-3">
            <h5 className="mb-3" style={{ color: "blue" }}>
              TIỆN NGHI NHÀ TRỌ
            </h5>
            <Row>
              {amenitiesList.map((amenity) => (
                <Col md={3} key={amenity.id}>
                  <Form.Check
                    label={amenity.name}
                    name={amenity.id.toString()}
                    type="checkbox"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleCheckboxChange(e, "amenities")
                    }
                  />
                </Col>
              ))}
            </Row>
            {errors.amenities && (
              <div className="text-danger mt-2">{errors.amenities}</div>
            )}
          </div>

          <div className="mb-3">
            <h5 className="mb-3" style={{ color: "blue" }}>
              MÔI TRƯỜNG XUNG QUANH
            </h5>
            <Row>
              {surroundingAreasList.map((area) => (
                <Col md={3} key={area.id}>
                  <Form.Check
                    label={area.name}
                    name={area.id.toString()}
                    type="checkbox"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleCheckboxChange(e, "surroundingAreas")
                    }
                  />
                </Col>
              ))}
            </Row>
            {errors.surroundingAreas && (
              <div className="text-danger mt-2">{errors.surroundingAreas}</div>
            )}
          </div>

          <div className="mb-3">
            <h5 className="mb-3" style={{ color: "blue" }}>
              ĐỊA ĐIỂM
            </h5>
            <Row>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Tỉnh/TP</Form.Label>
                  <Form.Select
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    isInvalid={!!errors.province}
                    style={{ width: "100%", height: "40px" }}
                  >
                    {provinces.map((prov, index) => (
                      <option key={index} value={prov}>
                        {prov}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.province}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Quận/Huyện</Form.Label>
                  <Form.Select
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    isInvalid={!!errors.district}
                    style={{ width: "100%", height: "40px" }}
                  >
                    {districts.map((dist, index) => (
                      <option key={index} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.district}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Phường/Xã</Form.Label>
                  <Form.Select
                    name="ward"
                    value={formData.ward}
                    onChange={handleInputChange}
                    isInvalid={!!errors.ward}
                    style={{ width: "100%", height: "40px" }}
                  >
                    {wards.map((w, index) => (
                      <option key={index} value={w}>
                        {w}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.ward}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Đường phố</Form.Label>
                  <Form.Select
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    isInvalid={!!errors.street}
                    style={{ width: "100%", height: "40px" }}
                  >
                    {streets.map((str, index) => (
                      <option key={index} value={str}>
                        {str}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.street}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mt-3">
              <Form.Label>Địa chỉ chi tiết</Form.Label>
              <Form.Control
                type="text"
                name="detailedAddress"
                value={formData.detailedAddress}
                onChange={handleInputChange}
                placeholder="Địa chỉ chi tiết"
                isInvalid={!!errors.detailedAddress}
                style={{ width: "100%", height: "40px" }}
              />
              <Form.Control.Feedback type="invalid">
                {errors.detailedAddress}
              </Form.Control.Feedback>
            </Form.Group>
          </div>

          <div className="mb-3">
            <h5 className="mb-3" style={{ color: "blue" }}>
              HÌNH ẢNH TỔNG QUAN
            </h5>
            <div
              style={{
                border: "2px dashed #007bff",
                padding: "20px",
                textAlign: "center",
                backgroundColor: "#f8f9fa",
                borderRadius: "5px",
              }}
            >
              <div>
                <i
                  className="bi bi-cloud-upload"
                  style={{ fontSize: "24px", color: "#007bff" }}
                ></i>
                <p style={{ color: "#007bff", margin: "10px 0" }}>
                  KÉO THẢ HÌNH ẢNH (Hoặc chọn hình ảnh)
                </p>
              </div>
              <Form.Control
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
                id="file-upload"
              />
              <Form.Label
                htmlFor="file-upload"
                style={{
                  cursor: "pointer",
                  padding: "8px 16px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  backgroundColor: "#fff",
                }}
              >
                Chọn hình ảnh
              </Form.Label>
            </div>
            {imagePreviews.length > 0 && (
              <div className="mt-3">
                <h6>Hình ảnh đã chọn:</h6>
                <Row>
                  {imagePreviews.map((url, index) => (
                    <Col md={3} key={index} className="mb-3">
                      <div style={{ position: "relative" }}>
                        <img
                          src={url}
                          alt={`Preview ${index}`}
                          style={{
                            width: "100%",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "5px",
                          }}
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          style={{
                            position: "absolute",
                            top: "5px",
                            right: "5px",
                          }}
                          onClick={() => handleRemoveImage(index)}
                        >
                          X
                        </Button>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            )}
            {errors.images && (
              <div className="text-danger mt-2">{errors.images}</div>
            )}
          </div>

          <div className="mb-3">
            <h5 className="mb-3" style={{ color: "blue" }}>
              THÔNG TIN LIÊN HỆ
            </h5>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Họ tên</Form.Label>
                  <Form.Control
                    type="text"
                    name="posterName"
                    value={profile?.fullName || formData.posterName}
                    onChange={handleInputChange}
                    placeholder="Họ tên"
                    isInvalid={!!errors.posterName}
                    style={{ width: "100%", height: "40px" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {profile?.fullName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control
                    type="text"
                    name="posterPhone"
                    value={formData.posterPhone}
                    onChange={handleInputChange}
                    placeholder="Số điện thoại"
                    isInvalid={!!errors.posterPhone}
                    style={{ width: "100%", height: "40px" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.posterPhone}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </div>

          <div className="d-flex gap-2">
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{ width: "100px", height: "40px" }}
            >
              {isSubmitting ? "Đang lưu..." : "Lưu"}
            </Button>
            <Button
              variant="outline-primary"
              onClick={() => navigate("/post-room")}
              disabled={isSubmitting}
              style={{ width: "100px", height: "40px" }}
            >
              Hủy bỏ
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default RoomPostForm;