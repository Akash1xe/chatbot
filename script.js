
let userType = document.getElementById("promptTextarea");
let userChatContainer = document.querySelector(".chat-container");
let imageButton = document.getElementById("image_button");
let imageInput = document.querySelector("#image_button input");
let image = document.querySelector("#image_button img");
let submitBtn = document.getElementById("submit")

// API configuration - will be loaded from config.js
let API_KEY = "";
let Api_Url = "";

// Initialize API configuration
function initializeAPI() {
  // Try to get from window.CONFIG (loaded from config.js)
  if (window.CONFIG && window.CONFIG.API_KEY) {
    API_KEY = window.CONFIG.API_KEY;
    console.log("✅ API configuration loaded from local config");
  } else {
    // For production, try to fetch from Vercel API endpoint
    fetchProductionConfig();
    return;
  }
  
  Api_Url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
}

// Fetch API configuration from production endpoint
async function fetchProductionConfig() {
  try {
    const response = await fetch('/config.js');
    if (response.ok) {
      const configScript = await response.text();
      eval(configScript); // Execute the config script
      
      if (window.CONFIG && window.CONFIG.API_KEY) {
        API_KEY = window.CONFIG.API_KEY;
        Api_Url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
        console.log("✅ API configuration loaded from production endpoint");
      } else {
        throw new Error("Invalid config from production endpoint");
      }
    } else {
      throw new Error("Failed to fetch production config");
    }
  } catch (error) {
    console.error("❌ Failed to load API configuration:", error);
    showAPIErrorMessage();
  }
}

// Show error message when API is not configured
function showAPIErrorMessage() {
  const errorHtml = `<i class="fa-solid fa-exclamation-triangle"></i>
    <div class="aiChatArea" style="background: rgba(255, 0, 0, 0.1); color: #ff6b6b;">
      ⚠️ API configuration error. Please check your environment variables in Vercel dashboard.
    </div>`;
  const errorBox = createUserBox(errorHtml, "ai-chatBox");
  userChatContainer.appendChild(errorBox);
}

// Initialize floating icons animation
document.addEventListener('DOMContentLoaded', function() {
  // Initialize API configuration first
  initializeAPI();
  
  // Then start animations
  initFloatingIcons();
});

function initFloatingIcons() {
  const icons = document.querySelectorAll('.floating-icon');
  
  icons.forEach((icon, index) => {
    // Set random initial position
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;
    
    gsap.set(icon, {
      x: startX,
      y: startY,
      opacity: 0.7,
      scale: Math.random() * 0.5 + 0.8
    });
    
    // Create continuous floating animation
    createFloatingAnimation(icon, index);
  });
}

function createFloatingAnimation(icon, index) {
  const tl = gsap.timeline({ repeat: -1 });
  
  // Generate random path points
  const points = [];
  for (let i = 0; i < 4; i++) {
    points.push({
      x: Math.random() * (window.innerWidth - 100),
      y: Math.random() * (window.innerHeight - 100)
    });
  }
  
  // Animate through the path points
  points.forEach((point, i) => {
    tl.to(icon, {
      x: point.x,
      y: point.y,
      duration: Math.random() * 8 + 5, // 5-13 seconds per segment
      ease: "sine.inOut",
      rotation: Math.random() * 360,
      scale: Math.random() * 0.8 + 0.8,
      opacity: Math.random() * 0.4 + 0.5
    });
  });
  
  // Add floating effect (up and down movement)
  gsap.to(icon, {
    y: "+=30",
    duration: 3 + Math.random() * 2,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut",
    delay: Math.random() * 2
  });
  
  // Add rotation animation
  gsap.to(icon, {
    rotation: "+=360",
    duration: 15 + Math.random() * 10,
    repeat: -1,
    ease: "none"
  });
  
  // Add scale breathing effect
  gsap.to(icon, {
    scale: "+=0.3",
    duration: 4 + Math.random() * 3,
    yoyo: true,
    repeat: -1,
    ease: "power2.inOut",
    delay: Math.random() * 3
  });
  
  // Add opacity pulsing
  gsap.to(icon, {
    opacity: Math.random() * 0.5 + 0.4,
    duration: 2 + Math.random() * 2,
    yoyo: true,
    repeat: -1,
    ease: "power2.inOut",
    delay: Math.random() * 4
  });
}

// Regenerate animation on window resize
window.addEventListener('resize', () => {
  gsap.killTweensOf('.floating-icon');
  initFloatingIcons();
});

let user = {
  message: null,
  file: {
    mime_type: null,
    data: null,
  },
};

async function generateResponse(aiChatBox) {
  // Check if API is properly configured
  if (!API_KEY || API_KEY === "YOUR_API_KEY_PLACEHOLDER") {
    console.error("❌ API key not configured");
    showAPIErrorMessage();
    return;
  }

  let text = document.querySelector(".aiChatArea");
  
  // Show loading state
  let loadingHtml = `<i class="fa-solid fa-brain"></i>
    <div class="aiChatArea loading">Thinking...</div>`;
  let loadingBox = createUserBox(loadingHtml, "ai-chatBox");
  userChatContainer.appendChild(loadingBox);
  userChatContainer.scrollTo({
    top: userChatContainer.scrollHeight,
    behavior: "smooth",
  });

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
    
    // Remove loading box
    userChatContainer.removeChild(loadingBox);
    
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
  // Prevent empty messages
  if (!userEnter.trim() && !user.file.data) {
    return;
  }
  
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
  
  // Add burst effect to floating icons on message send
  burstIconsEffect();
  
  // Disable input while processing
  userType.disabled = true;
  submitBtn.disabled = true;
  
  setTimeout(() => {
    generateResponse().finally(() => {
      // Re-enable input after response
      userType.disabled = false;
      submitBtn.disabled = false;
      userType.focus();
    });
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

// Add burst effect to floating icons
function burstIconsEffect() {
  const icons = document.querySelectorAll('.floating-icon');
  
  icons.forEach((icon, index) => {
    // Temporary burst animation
    gsap.to(icon, {
      scale: "+=0.5",
      opacity: "+=0.3",
      rotation: "+=180",
      duration: 0.8,
      ease: "back.out(1.7)",
      yoyo: true,
      repeat: 1,
      delay: index * 0.1
    });
  });
}

// Add mouse interaction effect
document.addEventListener('mousemove', (e) => {
  const icons = document.querySelectorAll('.floating-icon');
  
  icons.forEach((icon) => {
    const rect = icon.getBoundingClientRect();
    const iconCenterX = rect.left + rect.width / 2;
    const iconCenterY = rect.top + rect.height / 2;
    
    const distance = Math.sqrt(
      Math.pow(e.clientX - iconCenterX, 2) + 
      Math.pow(e.clientY - iconCenterY, 2)
    );
    
    // If mouse is close to icon, make it more visible and larger
    if (distance < 150) {
      const intensity = (150 - distance) / 150;
      gsap.to(icon, {
        scale: 1 + intensity * 0.8,
        opacity: 0.5 + intensity * 0.5,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  });
});

// Add click effect on chat container
document.querySelector('.chat-container').addEventListener('click', (e) => {
  // Create temporary sparkle effect at click position
  createSparkleEffect(e.clientX, e.clientY);
});

function createSparkleEffect(x, y) {
  const icons = document.querySelectorAll('.floating-icon');
  
  icons.forEach((icon, index) => {
    const rect = icon.getBoundingClientRect();
    const iconCenterX = rect.left + rect.width / 2;
    const iconCenterY = rect.top + rect.height / 2;
    
    const distance = Math.sqrt(
      Math.pow(x - iconCenterX, 2) + 
      Math.pow(y - iconCenterY, 2)
    );
    
    // Create ripple effect based on distance
    if (distance < 300) {
      const delay = distance / 300 * 0.5; // Further icons animate later
      
      gsap.to(icon, {
        scale: "+=0.8",
        opacity: "+=0.5",
        rotation: "+=360",
        duration: 1,
        ease: "elastic.out(1, 0.5)",
        delay: delay,
        yoyo: true,
        repeat: 1
      });
    }
  });
}
