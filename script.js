let userType = document.getElementById("promptTextarea");
let userChatContainer = document.querySelector(".chat-container");
let imageButton = document.getElementById("image_button");
let imageInput = document.querySelector("#image_button input");
let image = document.querySelector("#image_button img");
let submitBtn = document.getElementById("submit")

const API_KEY = "AIzaSyA2fQoqwpktTrzDmw19kl_8IyjaJ5LboP0"



const Api_Url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

let user = {
  message: null,
  file: {
    mime_type: null,
    data: null,
  },
};

async function generateResponse(aiChatBox) {
  let text = document.querySelector(".aiChatArea");
  let RequestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: user.message },
            ...(user.file.data ? [{ "inline_data": user.file }] : []
            ),
          ],
        },
      ],
    }),
  };

  try {
    let response = await fetch(Api_Url, RequestOptions);
    let data = await response.json();
    let apiResponse = data.candidates[0].content.parts[0].text.replace().trim();
    console.log(apiResponse);
    let aiResponseHtml = `<i class="fa-solid fa-brain"></i>
    <div class="aiChatArea">${apiResponse}</div>`;
    let aiResponseBox = createUserBox(aiResponseHtml, "ai-chatBox");

    // Append the new div to the chat container
    userChatContainer.appendChild(aiResponseBox);
  } catch (error) {
    console.log(error);
  } finally {
    userChatContainer.scrollTo({
      top: userChatContainer.scrollHeight,
      behavior: "smooth",
    });
    image.src = `imageForAi.jpg`
    image.classList.remove("chooseClass")
    user.file = {}

  }
}

function createUserBox(html, classes) {
  let div = document.createElement("div");
  div.innerHTML = html;
  div.classList.add(classes);
  return div;
}
// function generateResponse() {} // Removed duplicate function definition

function handleUserType(userEnter) {
  user.message = userEnter;
  let html = `<i class="fa-regular fa-user"></i>
        <div class="userChatArea">
         ${user.message}
         ${user.file.data ? `<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg" />` : ''}
        </div>`;
  userType.value = "";

  let userChatBox = createUserBox(html, "user-chatBox");
  userChatContainer.appendChild(userChatBox);
  userChatContainer.scrollTo({
    top: userChatContainer.scrollHeight,
    behavior: "smooth",
  });
  setTimeout(() => {
    generateResponse();
  }, 600);
}

userType.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    handleUserType(userType.value);
  }
});

submitBtn.addEventListener("click", () => {
  handleUserType(userType.value)
})

imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (!file) return;
  let reader = new FileReader();
  reader.onload = (e) => {
    console.log(e);

    let base64String = e.target.result.split(",")[1];
    user.file = {
      mime_type: file.type,
      data: base64String,
    };
    image.src = `data:${user.file.mime_type};base64,${user.file.data}`
    image.classList.add("chooseClass")
  };

  reader.readAsDataURL(file);
});

imageButton.addEventListener("click", () => {
  imageButton.querySelector("input").click();
});
