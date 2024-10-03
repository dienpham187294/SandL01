import { compareTwoStrings } from "string-similarity";

function findClosestMatch(inputString, arrayInput) {
  // console.log(arrayInput);
  let closestMatch = null;
  let highestSimilarity = 0;

  // Duyệt qua từng đối tượng trong arrayInput
  arrayInput.forEach((entry) => {
    // Duyệt qua từng chuỗi trong thuộc tính weSay của đối tượng
    entry.weSay.forEach((weSayString) => {
      // So sánh độ tương đồng giữa inputString và weSayString
      const similarity = compareTwoStrings(
        cleanString(inputString),
        cleanString(weSayString)
      );
      // console.log(inputString, weSayString, similarity);
      // Cập nhật độ tương đồng cao nhất và đối tượng tương ứng nếu cần
      if (similarity > highestSimilarity) {
        highestSimilarity = similarity;
        closestMatch = entry;
      }
    });
  });

  // Kiểm tra độ tương đồng có lớn hơn 0.6 không và trả về họSay của đối tượng tương ứng
  if (highestSimilarity > 0.5 && closestMatch) {
    return closestMatch;
  }

  return { theySay: ["What do you mean?"] };
}

const getRandomElement = (array) => {
  // Kiểm tra nếu mảng rỗng
  if (array.length === 0) {
    return null; // Hoặc throw new Error('Array is empty') tùy theo yêu cầu của bạn
  }

  // Tính toán chỉ số ngẫu nhiên trong mảng
  const randomIndex = Math.floor(Math.random() * array.length);

  // Trả về phần tử tại chỉ số ngẫu nhiên
  return array[randomIndex];
};

function parceARandomSets(n) {
  // Tạo mảng từ 0 đến n
  let array = Array.from({ length: n + 1 }, (_, i) => i);

  // Đảo ngẫu nhiên mảng bằng phương pháp Fisher-Yates
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Hoán đổi vị trí
  }

  return array;
}

function shuffleArray(array) {
  let newArray = array.slice(); // Sao chép mảng để giữ nguyên mảng gốc
  for (let i = newArray.length - 1; i > 0; i--) {
    let randomIndex = Math.floor(Math.random() * (i + 1)); // Chọn một chỉ mục ngẫu nhiên từ 0 đến i
    // Hoán đổi phần tử hiện tại với phần tử ngẫu nhiên
    [newArray[i], newArray[randomIndex]] = [newArray[randomIndex], newArray[i]];
  }
  return newArray; // Trả về mảng đã được xáo trộn
}
function collectWeSay(arr, keySets) {
  // Sử dụng reduce để gom tất cả các giá trị từ các key trong keySets
  return arr.reduce((result, current) => {
    // Loop qua từng key trong keySets
    keySets.forEach((key) => {
      // Kiểm tra nếu key tồn tại trong current
      if (current[key]) {
        // Kết hợp kết quả với giá trị từ key hiện tại
        result = result.concat(current[key]);
      }
    });
    return result;
  }, []);
}

function cleanString(str) {
  return str
    .toLowerCase() // Chuyển về chữ thường
    .normalize("NFD") // Chuẩn hóa các ký tự có dấu thành dạng đơn
    .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu
    .replace(/[^a-z0-9\s]/g, ""); // Loại bỏ ký tự đặc biệt, chỉ giữ chữ cái, số và khoảng trắng
}

function removeNoneElements(arr) {
  // Sử dụng filter để loại bỏ các phần tử có giá trị là "None"
  return arr.filter(
    (element) => element !== "None" && element !== null && element !== "null"
  );
}

const qsSets = [
  "What is your name?",
  "How old are you?",
  "Where are you from?",
  "Do you speak English?",
  "What do you do?",
  "How are you today?",
  "Where do you live?",
  "Do you have any pets?",
  "Can you help me, please?",
  "What time is it?",
  "Do you like coffee?",
  "What is your favorite color?",
  "How many brothers or sisters do you have?",
  "Do you have a phone number?",
  "Are you married?",
  "What is your job?",
  "What is your hobby?",
  "Where is the nearest supermarket?",
  "What’s your email address?",
  "How much does this cost?",
  "Do you have any children?",
  "What’s your favorite food?",
  "What’s your favorite movie?",
  "Where is the bathroom?",
  "What’s your address?",
  "Can I have the bill, please?",
  "How do you spell your name?",
  "How do you get to work?",
  "Can you repeat that, please?",
  "What’s your favorite book?",
  "How long have you lived here?",
  "Where do you study?",
  "What time do you wake up?",
  "What do you like to do on weekends?",
  "Can I help you?",
  "How much is this?",
  "Do you like music?",
  "What’s your phone number?",
  "What do you do in your free time?",
  "What is your favorite sport?",
  "Are you tired?",
  "Where is the train station?",
  "Can you speak slowly, please?",
  "How do you feel today?",
  "Where are we going?",
  "Do you like to travel?",
  "What’s the weather like today?",
  "How far is it from here?",
  "What’s your favorite season?",
  "Where is the nearest bus stop?",
];
function pickRandomN(arr, n) {
  // Kiểm tra nếu n lớn hơn số phần tử trong mảng
  if (n > arr.length) {
    return "Số phần tử cần chọn lớn hơn số phần tử trong mảng!";
  }

  // Tạo một mảng sao chép để tránh thay đổi mảng gốc
  let shuffled = arr.slice();

  // Sắp xếp ngẫu nhiên mảng sao chép
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Trả về n phần tử đầu tiên từ mảng đã xáo trộn
  return shuffled.slice(0, n);
}
export {
  findClosestMatch,
  getRandomElement,
  parceARandomSets,
  shuffleArray,
  collectWeSay,
  removeNoneElements,
  qsSets,
  pickRandomN,
};
