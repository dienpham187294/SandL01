import { useState, useEffect } from "react";

// Hàm tạo link từ các tham số
function getLink(id, index, selectedTypes, lessonSetLength) {
  // Tạo lessonSet từ 0 đến lessonSetLength-1
  const lessonSet = Array.from({ length: lessonSetLength }, (_, i) => i);

  // Tối ưu hóa danh sách selectedTypes
  const optimizedTypeString = optimizeTypeList(selectedTypes);

  // Tạo tham số a từ lessonSet
  const aParam = lessonSet.join("zz");

  // Tạo link cuối cùng
  return `roomoffline/${id}/${index}?a=${aParam}&&b=${optimizedTypeString}`;
}

// Hàm tối ưu hóa danh sách type đã chọn
function optimizeTypeList(selectedTypes) {
  if (!selectedTypes || selectedTypes.length === 0) {
    return "";
  }

  // Nhóm các type theo chữ cái đầu tiên
  const groupedTypes = {};
  selectedTypes.forEach((type) => {
    const prefix = type.charAt(0);
    if (!groupedTypes[prefix]) {
      groupedTypes[prefix] = [];
    }
    const num = parseInt(type.substring(1));
    groupedTypes[prefix].push(num);
  });

  // Tối ưu hóa từng nhóm
  const optimizedParts = [];

  for (const prefix in groupedTypes) {
    const numbers = groupedTypes[prefix].sort((a, b) => a - b);

    // Kiểm tra xem có lấy tất cả các giá trị từ 1-25 không
    if (numbers.length === 25 && numbers.every((val, idx) => val === idx + 1)) {
      optimizedParts.push(`${prefix}*`);
      continue;
    }

    // Tìm và tạo các dải số liên tục
    let i = 0;
    while (i < numbers.length) {
      let start = numbers[i];
      let end = start;

      // Tìm dải số liên tục
      while (i + 1 < numbers.length && numbers[i + 1] === end + 1) {
        end = numbers[++i];
      }

      // Thêm vào kết quả theo định dạng phù hợp
      if (start === end) {
        optimizedParts.push(`${prefix}${start}`);
      } else if (end - start >= 2) {
        optimizedParts.push(`${prefix}${start}-${end}`);
      } else {
        optimizedParts.push(`${prefix}${start}`, `${prefix}${end}`);
      }

      i++;
    }
  }

  return optimizedParts.join("zz");
}

// Component chính đổi tên thành GetLink
export default function GetLink({ id, index, lessonSetLength, typeSet }) {
  // Chuyển đổi các prop thành số nếu cần
  const numIndex = parseInt(index) || 0;
  const numLessonSetLength = parseInt(lessonSetLength) || 10;

  // Khởi tạo trạng thái
  const [selectedTypes, setSelectedTypes] = useState(typeSet || []);
  const [generatedLink, setGeneratedLink] = useState("");

  // Nhóm typeSet thành các nhóm A, B, C để hiển thị
  const groupedTypes = {};
  if (Array.isArray(typeSet)) {
    typeSet.forEach((type) => {
      if (type && typeof type === "string") {
        const prefix = type.charAt(0);
        if (!groupedTypes[prefix]) {
          groupedTypes[prefix] = [];
        }
        groupedTypes[prefix].push(type);
      }
    });
  }

  // Cập nhật link khi có thay đổi
  useEffect(() => {
    if (selectedTypes.length > 0) {
      const link = getLink(id, numIndex, selectedTypes, numLessonSetLength);
      setGeneratedLink(link);
    } else {
      setGeneratedLink("");
    }
  }, [selectedTypes, id, numIndex, numLessonSetLength]);

  // Xử lý khi chọn/bỏ chọn một type
  const handleTypeToggle = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  // Xử lý khi chọn/bỏ chọn tất cả các type có cùng prefix
  const handleGroupToggle = (prefix) => {
    if (!Array.isArray(typeSet)) return;

    const groupTypes = typeSet.filter((t) => t && t.startsWith(prefix));
    const allSelected = groupTypes.every((t) => selectedTypes.includes(t));

    if (allSelected) {
      // Bỏ chọn tất cả các type trong nhóm
      setSelectedTypes(selectedTypes.filter((t) => !t.startsWith(prefix)));
    } else {
      // Chọn tất cả các type trong nhóm
      const newSelected = [...selectedTypes];
      groupTypes.forEach((t) => {
        if (!newSelected.includes(t)) {
          newSelected.push(t);
        }
      });
      setSelectedTypes(newSelected);
    }
  };

  // Hàm sao chép link vào clipboard
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(generatedLink)
      .then(() => alert("Đã sao chép link vào clipboard!"))
      .catch((err) => console.error("Lỗi khi sao chép: ", err));
  };

  return (
    <div
      style={{ border: "1px solid black", backgroundColor: "white" }}
      className="p-4 max-w-4xl mx-auto"
    >
      <h1 className="text-2xl font-bold mb-4">Bảng chọn Type</h1>

      <div className="mb-6">
        {Object.keys(groupedTypes).map((prefix) => (
          <div key={prefix} className="mb-4">
            <div className="flex items-center mb-2">
              <h2 className="text-lg font-semibold">Nhóm {prefix}</h2>
              <button
                onClick={() => handleGroupToggle(prefix)}
                className="ml-4 bg-blue-500 text-white px-3 py-1 rounded text-sm"
              >
                {groupedTypes[prefix].every((t) => selectedTypes.includes(t))
                  ? "Bỏ chọn tất cả"
                  : "Chọn tất cả"}
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {groupedTypes[prefix].map((type) => (
                <button
                  key={type}
                  onClick={() => handleTypeToggle(type)}
                  className={`p-2 rounded border ${
                    selectedTypes.includes(type)
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-800"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {generatedLink && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="text-lg font-semibold mb-2">Generated Link:</h3>
          <div className="flex items-center">
            <div className="flex-grow p-2 bg-white border rounded overflow-x-auto">
              {generatedLink}
            </div>
            <button
              onClick={copyToClipboard}
              className="ml-2 bg-green-500 text-white px-4 py-2 rounded"
            >
              Copy
            </button>
          </div>
          <div className="mt-4">
            <p>
              <strong>Selected Types:</strong> {selectedTypes.length}
            </p>
            <p>
              <strong>Lesson Set:</strong> {numLessonSetLength} items (0 to{" "}
              {numLessonSetLength - 1})
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
