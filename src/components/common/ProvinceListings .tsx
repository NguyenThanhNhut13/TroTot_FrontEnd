import React from "react";

// Định nghĩa kiểu cho props
interface ProvinceListingsProps {
  provinces: Province[];
}

interface Province {
  name: string;
  rooms: number;
}

const ProvinceListings: React.FC<ProvinceListingsProps> = ({ provinces }) => {
  return (
    <div className="province-listings p-4 bg-light rounded shadow-sm">
      <h2 className="text-primary fw-bold">KHÁM PHÁ THÊM TRỌ MỚI Ở CÁC TỈNH THÀNH</h2>
      <p className="text-muted">Dưới đây là tổng hợp các tỉnh thành có nhiều trọ mới và được quan tâm nhất</p>
      <div className="row">
        {provinces.map((province, index) => (
          <div key={index} className="col-md-4 mb-3">
            <h5 className="fw-bold">{province.name}</h5>
            <p className="text-muted">{province.rooms} phòng trọ</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProvinceListings;
