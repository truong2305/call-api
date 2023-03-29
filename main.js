/** @format */

const skeleton = document.getElementById("skeleton");
const news = document.getElementById("news");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let renderItem = (item) => {
  let date = new Date(item.createdAt).toLocaleDateString();
  let node = document.createElement("div");
  node.innerHTML = `<a href="#" class="text-dark">
                        <div class="row mb-4 border-bottom pb-3">
                        <div class="col-3">
                            <img
                            src="${item.image}"
                            class="img-fluid shadow-strong rounded"
                            alt="${item.title}"
                            />
                        </div>
                        <div class="col-9">
                            <p class="mb-2"><strong>${item.title}</strong></p>
                            <p><u>${date}</u></p>
                        </div>
                        </div>
                    </a>`;
  return node;
};

let page = 1;
let isCompelete = true;
let isFinalData = false;

const getNews = async () => {
  skeleton.style.display = "block";
  isCompelete = false;

  try {
    const res = await axios.get("https://5f55a98f39221c00167fb11a.mockapi.io/blogs", {
      params: {
        limit: 10,
        page,
      },
    });
    if (!(res.data && res.data.length)) {
      isFinalData = true;
      document.getElementById("end-page").innerText = "End page";
      return;
    }
    await delay(1000);
    res.data.map((item) => news.appendChild(renderItem(item)));
    page += 1;
  } catch (error) {
    alert(error.message);
  } finally {
    isCompelete = true;
    skeleton.style.display = "none";
  }
};

const debounce = (func, delay = 100) => {
  let timeout;
  return () => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(func, delay);
  };
};

const handleInfiniteScroll = () => {
  const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
  if (endOfPage && isCompelete && !isFinalData) getNews();
};

window.onload = () => getNews();
window.addEventListener("scroll", debounce(handleInfiniteScroll));
