const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = "https://lighthouse-user-api.herokuapp.com/api/v1/users";
const data = []; //儲存資料的地方
const dataPanel = document.querySelector("#data-panel"); //選出用來放動態資料的節點

//串接全部人的資料
axios
  .get(INDEX_URL)
  .then(response => {
    data.push(...response.data.results);
    // displayUser(data);
    getPageData(1, data);
    getTotalPages(data);
  })
  .catch(err => console.log(err));
//動態渲染所有人資料的function
function displayUser(data) {
  let htmlContent = "";
  data.forEach(item => {
    htmlContent += `
<div class="col-sm-4">
<div class="card">
    <img src="${item.avatar}" class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title">${item.name}${item.surname} (${item.age})</h5>
    </div>
    <div class="card-footer">
      <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" data-id="${item.id}">
 Personal Information 
</button>
    </div>
  </div>
</div>
`;
  });
  dataPanel.innerHTML = htmlContent;
}

//監聽點擊Personal Information事件
dataPanel.addEventListener("click", event => {
  if (event.target.matches(".btn")) {
    showInformation(event.target.dataset.id);
  }
});
//顯示Personal Information的function
function showInformation(id) {
  //選出Modal中要修改的節點
  const modalTitle = document.querySelector(".modal-title");
  const modalBody = document.querySelector(".modal-body");
  const url = `https://lighthouse-user-api.herokuapp.com/api/v1/users/${id}`;
  //串接API
  axios.get(url).then(response => {
    let data = response.data;
    modalTitle.textContent = data.name + data.surname;
    modalBody.innerHTML = `
<p>Email : ${data.email}</p> 
<p>Gender : ${data.gender}</p>
<p>Age : ${data.age}</p>
<p>Birthday : ${data.birthday}</p>`;
  });
}

//監聽選擇gender事件
const selectGender = document.querySelector(".select-gender");
selectGender.addEventListener("click", event => {
  if (event.target.matches(".for-male")) {
    let males = data.filter(people => people.gender === "male");
    // displayUser(males);
    getTotalPages(males);
    getPageData(1, males);
  } else if (event.target.matches(".for-female")) {
    let females = data.filter(people => people.gender === "female");
    // displayUser(females);
    getTotalPages(females);
    getPageData(1, females);
  }
});
// 監聽點擊頁首Icon會顯示所有人資料

const meetFriends = document.querySelector(".meet-friends");
meetFriends.addEventListener("click", event => {
  displayUser(data);
});

//監聽按鈕search點擊事件
const searchForm = document.getElementById("search");
const searchInput = document.getElementById("search-input");
searchForm.addEventListener("submit", event => {
  event.preventDefault();
  let input = searchInput.value;
  let results = data.filter(people => people.age === Number(input));
  // displayUser(results)
  getTotalPages(results);
  getPageData(1, results);
});

//計算總頁數並演算 li.page-item
const pagination = document.getElementById("pagination");
const ITEM_PER_PAGE = 20;
function getTotalPages(data) {
  let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1;
  let pageItemContent = "";
  for (let i = 0; i < totalPages; i++) {
    pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i +
      1}</a>
        </li>
      `;
  }
  pagination.innerHTML = pageItemContent;
}

//新增 Pagination 標籤的事件監聽器
pagination.addEventListener("click", event => {
  if (event.target.tagName === "A") {
    getPageData(event.target.dataset.page);
  }
});
let paginationData = [];
function getPageData(pageNum, data) {
  paginationData = data || paginationData;
  let offset = (pageNum - 1) * ITEM_PER_PAGE;
  let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE);
  displayUser(pageData);
}
