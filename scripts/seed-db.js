require("dotenv").config();

const mongoose = require("mongoose");
const { connectMongo } = require("../src/db/connect");
const schemas = require("../src/schemas");

const {
  ChungCu,
  ChungCuImage,
  CanHo,
  CanHoImage,
  NguoiDung,
  CuDan,
  ChuHo,
  TinTuc,
} = schemas;

function toDecimal128(value) {
  if (value === null || value === undefined) return undefined;
  return mongoose.Types.Decimal128.fromString(String(value));
}

async function ensureCollections() {
  const modelList = Object.entries(schemas);
  for (const [name, model] of modelList) {
    await model.createCollection();
    await model.syncIndexes().catch(() => undefined);
    console.log("[mongo] ensured collection for", name, "=>", model.collection.name);
  }
}

async function upsertReturn(Model, filter, setDoc) {
  return Model.findOneAndUpdate(
    filter,
    { $set: setDoc, $setOnInsert: {} },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
}

async function upsertIgnoreDuplicate(Model, filter, setDoc) {
  try {
    await Model.updateOne(filter, { $setOnInsert: setDoc }, { upsert: true });
  } catch (err) {
    // ignore duplicate key errors (e.g. race/parallel runs)
    if (err && (err.code === 11000 || err.code === 11001)) return;
    throw err;
  }
}

async function main() {
  await connectMongo();
  await ensureCollections();

  // Buildings ---------------------------------------------------------------
  const buildings = [
    {
      ten: "APT Skyline",
      diaChi: "123 Đường Hoa Phượng, TP.HCM",
      chuDauTu: "PHQ Group",
      namXayDung: 2020,
      soTang: 25,
      moTa: "Khu phức hợp cao cấp",
    },
    {
      ten: "Sunrise City",
      diaChi: "58 Nguyễn Hữu Thọ, Quận 7, TP.HCM",
      chuDauTu: "Novaland",
      namXayDung: 2018,
      soTang: 25,
      moTa: "Tổ hợp thương mại - căn hộ",
    },
    {
      ten: "Eco Green Saigon",
      diaChi: "5 Tân Thuận Tây, Quận 7, TP.HCM",
      chuDauTu: "Sài Gòn Nam Long",
      namXayDung: 2020,
      soTang: 30,
      moTa: "Phân khu xanh và tiện ích",
    },
    // Extra buildings
    {
      ten: "Chung cư APT Skyline",
      diaChi: "123 Hoa Phượng, Quận 1, TP.HCM",
      chuDauTu: "PHQ Group",
      namXayDung: 2020,
      soTang: 25,
      moTa: "Dự án căn hộ cao cấp, tiện ích đầy đủ",
    },
    {
      ten: "Chung cư Green City",
      diaChi: "456 Lê Lợi, Quận Hải Châu, Đà Nẵng",
      chuDauTu: "GreenLand",
      namXayDung: 2018,
      soTang: 30,
      moTa: "Khu căn hộ xanh, gần công viên",
    },
    {
      ten: "Chung cư Sun Plaza",
      diaChi: "789 Trần Phú, Quận 5, TP.HCM",
      chuDauTu: "Sun Holding",
      namXayDung: 2019,
      soTang: 28,
      moTa: "Căn hộ cao cấp, gần trung tâm thương mại",
    },
    {
      ten: "Chung cư River View",
      diaChi: "12 Nguyễn Huệ, TP. Thủ Đức",
      chuDauTu: "River Corp",
      namXayDung: 2021,
      soTang: 35,
      moTa: "View sông, không gian thoáng mát",
    },
    {
      ten: "Chung cư Ocean Park",
      diaChi: "88 Võ Nguyên Giáp, TP. Đà Nẵng",
      chuDauTu: "Ocean Group",
      namXayDung: 2017,
      soTang: 22,
      moTa: "Gần biển, phù hợp nghỉ dưỡng",
    },
    {
      ten: "Chung cư City Garden",
      diaChi: "35 Điện Biên Phủ, Bình Thạnh, HCM",
      chuDauTu: "CityHome",
      namXayDung: 2016,
      soTang: 21,
      moTa: "Khu căn hộ nhiều cây xanh, hồ bơi",
    },
    {
      ten: "Chung cư Central Park",
      diaChi: "720 Điện Biên Phủ, Quận Bình Thạnh",
      chuDauTu: "Vingroup",
      namXayDung: 2015,
      soTang: 40,
      moTa: "Tổ hợp căn hộ + TTTM cao cấp",
    },
    {
      ten: "Chung cư Lake View",
      diaChi: "25A Phạm Văn Đồng, Hà Nội",
      chuDauTu: "LakeHouse",
      namXayDung: 2019,
      soTang: 26,
      moTa: "View hồ, không gian yên tĩnh",
    },
    {
      ten: "Chung cư An Cư Residence",
      diaChi: "15 Lê Văn Việt, TP. Thủ Đức",
      chuDauTu: "An Cư Corp",
      namXayDung: 2022,
      soTang: 18,
      moTa: "Dành cho gia đình trẻ, giá hợp lý",
    },
    {
      ten: "Chung cư Golden Home",
      diaChi: "99 Nguyễn Văn Cừ, TP. Cần Thơ",
      chuDauTu: "Golden Home JSC",
      namXayDung: 2020,
      soTang: 24,
      moTa: "Căn hộ hiện đại, gần trường học và bệnh viện",
    },
  ];

  const buildingByName = new Map();
  for (const b of buildings) {
    const doc = await upsertReturn(ChungCu, { ten: b.ten }, b);
    buildingByName.set(b.ten, doc);
  }

  // Apartments --------------------------------------------------------------
  const apartments = [
    {
      maCan: "A1-05",
      tenChungCu: "APT Skyline",
      dienTich: 75,
      soPhong: 3,
      gia: 2500000000,
      trangThai: "Dang ban",
      moTa: "Căn góc hướng Đông, nội thất cao cấp",
      urls: ["/images/canho/A105-1.jpg", "/images/canho/A105-2.jpg"],
    },
    {
      maCan: "B2-12",
      tenChungCu: "APT Skyline",
      dienTich: 68,
      soPhong: 2,
      gia: 1800000000,
      trangThai: "Cho thue",
      moTa: "View hồ bơi, đầy đủ nội thất",
      urls: [],
    },
    {
      maCan: "S1-09",
      tenChungCu: "Sunrise City",
      dienTich: 90,
      soPhong: 3,
      gia: 3200000000,
      trangThai: "Dang ban",
      moTa: "Ban công lớn, tầng trung",
      urls: ["/images/canho/S109.jpg"],
    },
    // Extra
    {
      maCan: "C01-01",
      tenChungCu: "Chung cư APT Skyline",
      dienTich: 65,
      soPhong: 2,
      gia: 1500000000,
      trangThai: "Dang ban",
      moTa:
        "Căn hộ 2 phòng ngủ tại dự án APT Skyline. Thiết kế hiện đại, tối ưu không gian. Ban công rộng rãi hướng Đông Nam, đón nắng và gió mát cả ngày. Nội thất cơ bản, sẵn sàng dọn vào ở.",
      urls: [
        "https://dwmksmgzljllumyaajti.supabase.co/storage/v1/object/public/apt-assets/apartments/1.jpg",
        "https://dwmksmgzljllumyaajti.supabase.co/storage/v1/object/public/apt-assets/apartments/2.jpg",
        "https://dwmksmgzljllumyaajti.supabase.co/storage/v1/object/public/apt-assets/apartments/3.jpg",
      ],
    },
    {
      maCan: "C01-02",
      tenChungCu: "Chung cư APT Skyline",
      dienTich: 70,
      soPhong: 2,
      gia: 1600000000,
      trangThai: "Dang ban",
      moTa:
        "Căn hộ 2 phòng ngủ, nằm ở tầng trung yên tĩnh. Layout vuông vắn, không có góc chết, phòng khách liên thông với khu vực bếp tạo cảm giác mở và thoáng đãng.",
      urls: [
        "https://dwmksmgzljllumyaajti.supabase.co/storage/v1/object/public/apt-assets/apartments/4.jpg",
        "https://dwmksmgzljllumyaajti.supabase.co/storage/v1/object/public/apt-assets/apartments/5.jpg",
      ],
    },
  ];

  const apartmentByKey = new Map();
  for (const a of apartments) {
    const chungCu = buildingByName.get(a.tenChungCu);
    if (!chungCu) {
      console.warn("[seed] missing building for apartment:", a.maCan, a.tenChungCu);
      continue;
    }

    const doc = await upsertReturn(
      CanHo,
      { maCan: a.maCan, idChungCu: chungCu._id },
      {
        maCan: a.maCan,
        idChungCu: chungCu._id,
        dienTich: a.dienTich,
        soPhong: a.soPhong,
        gia: toDecimal128(a.gia),
        trangThai: a.trangThai,
        moTa: a.moTa,
        urls: a.urls,
      },
    );

    apartmentByKey.set(`${a.tenChungCu}::${a.maCan}`, doc);
  }

  // Users -------------------------------------------------------------------
  const users = [
    {
      hoTen: "Nguyễn Văn Admin",
      email: "admin@apt.local",
      matKhau:
        "$2b$10$oBHOIVqSFCyXrVqSSH9e8e.xbgw0aQMxg2N03QzMWZYUm9t6WwoGG",
      soDienThoai: "0909000000",
      loaiNguoiDung: "Ban quan ly",
    },
    {
      hoTen: "Lê Thị Cư Dân",
      email: "resident@apt.local",
      matKhau:
        "$2b$10$QydiocIhAPfF1JVhHRVjGeRQGa8vzSVnKFgsKEQBikop0wFEmyW3S",
      soDienThoai: "0909111222",
      loaiNguoiDung: "Cu dan",
    },
  ];

  for (const u of users) {
    await upsertReturn(NguoiDung, { email: u.email.toLowerCase() }, u);
  }

  // Resident mapping + owner ------------------------------------------------
  const resident = await NguoiDung.findOne({ email: "resident@apt.local" });
  const a105 = apartmentByKey.get("APT Skyline::A1-05");
  const skyline = buildingByName.get("APT Skyline");

  if (resident && a105 && skyline) {
    const cuDan = await upsertReturn(CuDan, { idNguoiDung: resident._id }, {
      idNguoiDung: resident._id,
      idCanHo: a105._id,
      idChungCu: skyline._id,
    });

    await upsertReturn(ChuHo, { idCanHo: a105._id }, {
      idCuDan: cuDan._id,
      idCanHo: a105._id,
      idChungCu: skyline._id,
      ghiChu: "Chủ hộ mặc định từ seed",
    });
  } else {
    console.warn("[seed] skipped CuDan/ChuHo (missing resident or A1-05)");
  }

  // News --------------------------------------------------------------------
  const now = Date.now();
  const news = [
    {
      tieuDe: "Thông báo bảo trì thang máy",
      noiDung:
        "Thang máy tháp A bảo trì ngày 15/03. Quý cư dân vui lòng sử dụng thang B.",
      hinhAnh: "/images/news/baotri.jpg",
    },
    {
      tieuDe: "Sự kiện cuối tuần",
      noiDung: "BBQ cộng đồng tại khu vườn tầng 5 lúc 18h ngày 20/03.",
      hinhAnh: "/images/news/bbq.jpg",
    },
    {
      tieuDe: "Phản ánh tiếng ồn vào ban đêm tại hành lang tầng cao",
      noiDung:
        "Nhiều cư dân phản ánh tình trạng nói chuyện lớn tiếng, tụ tập tại hành lang sau 22h làm ảnh hưởng đến sinh hoạt và giấc ngủ của các hộ gia đình. Ban quản lý đề nghị cư dân tuân thủ quy định giữ trật tự chung.",
      ngayDang: new Date(now - 3 * 24 * 60 * 60 * 1000),
      hinhAnh:
        "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80",
    },
    {
      tieuDe: "Một số căn hộ gặp tình trạng rò rỉ nước nhà vệ sinh",
      noiDung:
        "Một số hộ tại các tầng trung cho biết nhà vệ sinh bị thấm nước, ố vàng trần và tường. Ban quản lý đã ghi nhận và phối hợp với đơn vị thi công kiểm tra, lên phương án xử lý dứt điểm để tránh ảnh hưởng lâu dài đến kết cấu công trình.",
      ngayDang: new Date(now - 5 * 24 * 60 * 60 * 1000),
      hinhAnh:
        "https://images.unsplash.com/photo-1519710884009-22a59b772e2f?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  for (const n of news) {
    await upsertReturn(TinTuc, { tieuDe: n.tieuDe }, n);
  }

  // Images ------------------------------------------------------------------
  const buildingImages = [
    {
      tenChungCu: "Chung cư Golden Home",
      duongDan:
        "https://dwmksmgzljllumyaajti.supabase.co/storage/v1/object/public/apt-assets/buildings/gd-1764562317239.jpg",
    },
    {
      tenChungCu: "Chung cư An Cư Residence",
      duongDan:
        "https://dwmksmgzljllumyaajti.supabase.co/storage/v1/object/public/apt-assets/buildings/ancu-1764562421522.jpg",
    },
    {
      tenChungCu: "Chung cư Central Park",
      duongDan:
        "https://dwmksmgzljllumyaajti.supabase.co/storage/v1/object/public/apt-assets/buildings/vinhomes-central-park-landmark-1-gia-ban-chi-tiet-cac-loai-can-ho-1-1764562578627.jpg",
    },
    {
      tenChungCu: "Chung cư City Garden",
      duongDan:
        "https://dwmksmgzljllumyaajti.supabase.co/storage/v1/object/public/apt-assets/buildings/01-du-an-city-garden-nhin-tu-xa-1764562651636.jpg",
    },
    {
      tenChungCu: "Chung cư Green City",
      duongDan:
        "https://dwmksmgzljllumyaajti.supabase.co/storage/v1/object/public/apt-assets/buildings/grenncity-1764566689147.JPG",
    },
    {
      tenChungCu: "Chung cư Lake View",
      duongDan:
        "https://dwmksmgzljllumyaajti.supabase.co/storage/v1/object/public/apt-assets/buildings/hanoi-lake-view_2013103110726-1764566760737.jpg",
    },
    {
      tenChungCu: "Chung cư Ocean Park",
      duongDan:
        "https://dwmksmgzljllumyaajti.supabase.co/storage/v1/object/public/apt-assets/buildings/vincity-ocean-park-2225-1764566818631.jpg",
    },
    {
      tenChungCu: "Chung cư River View",
      duongDan:
        "https://dwmksmgzljllumyaajti.supabase.co/storage/v1/object/public/apt-assets/buildings/vrg-river-view-1_2201222643-1764566868485.jpg",
    },
    {
      tenChungCu: "Chung cư Sun Plaza",
      duongDan:
        "https://dwmksmgzljllumyaajti.supabase.co/storage/v1/object/public/apt-assets/buildings/tttm-sun-plaza-ancora-du-kien-chinh-thuc-khai-truong-vao-ngay-11-1-2019-anh-minh-hoa-15466005797861654199583-1764566922159.webp",
    },
  ];

  for (const img of buildingImages) {
    const chungCu = buildingByName.get(img.tenChungCu);
    if (!chungCu) continue;
    await upsertIgnoreDuplicate(
      ChungCuImage,
      { idChungCu: chungCu._id, duongDan: img.duongDan },
      { idChungCu: chungCu._id, duongDan: img.duongDan },
    );
  }

  const defaultApartmentImages = [
    "https://dwmksmgzljllumyaajti.supabase.co/storage/v1/object/public/apt-assets/apartments/1.jpg",
    "https://dwmksmgzljllumyaajti.supabase.co/storage/v1/object/public/apt-assets/apartments/4.jpg",
    "https://dwmksmgzljllumyaajti.supabase.co/storage/v1/object/public/apt-assets/apartments/9.jpg",
  ];

  await CanHo.updateMany(
    {
      $or: [{ urls: { $exists: false } }, { urls: { $size: 0 } }],
    },
    { $set: { urls: defaultApartmentImages } },
  );

  const allApartments = await CanHo.find({}, { _id: 1 });
  for (const canHo of allApartments) {
    for (const url of defaultApartmentImages) {
      await upsertIgnoreDuplicate(
        CanHoImage,
        { idCanHo: canHo._id, duongDan: url },
        { idCanHo: canHo._id, duongDan: url },
      );
    }
  }

  const counts = {
    chungcus: await ChungCu.countDocuments(),
    canhos: await CanHo.countDocuments(),
    nguoidungs: await NguoiDung.countDocuments(),
    cudans: await CuDan.countDocuments(),
    chuho: await ChuHo.countDocuments(),
    tintucs: await TinTuc.countDocuments(),
  };

  console.log("[seed] done:", counts);

  await mongoose.disconnect();
  console.log("[mongo] disconnected");
}

main().catch(async (err) => {
  console.error("[seed] failed:", err);
  try {
    await mongoose.disconnect();
  } catch {
    // ignore
  }
  process.exitCode = 1;
});
