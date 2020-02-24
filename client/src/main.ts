import "./style.css";

import bot from "./assets/bot.svg";
import user from "./assets/user.svg";

const form = document.getElementById("form") as HTMLFormElement;
const chat_container = document.getElementById("chat_container") as HTMLElement;

let loadInterval: number;

function loader(element: HTMLElement): void {
  element.textContent = "";
  loadInterval = setInterval(() => {
    element.textContent += ".";

    if (element.textContent === "....") {
      element.textContent = "";
    }
  }, 300);
}


function typeText(element: HTMLElement, text: string): void {
  let index = 0;

  let interval = setInterval(() => {
    
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
      let angle = chat_container.getBoundingClientRect()
      window.scrollTo(0, angle.height)
    } else {
      form.classList.remove("hide")
      clearInterval(interval);
    }
  }, 20);
}

function generateId(): string {
  const time = Date.now();
  const random = Math.random();
  const decimalString = random.toString(16);

  return `id-${time}-${decimalString}`;
}

function chatStripe(ai: boolean, value: string, id: string): string {
  return `<div class="text-wrap" id= ${ai ? "ai" : ""}>
<div class="chat">

<div class="profile">
<img src="${ai ? bot : user}" alt="profile svg"/>
</div>

<p class="message" id=${id}>
${value}
</p>
</div>
</div>`;
}

async function handleSubmit(e: any) {
  e.preventDefault();

  const data = new FormData(form);
  console;

  //User Typed
  chat_container.innerHTML += chatStripe(
    false,
    data.get("prompt") as string,
    ""
  );
  let angle = chat_container.getBoundingClientRect()
  window.scrollTo(0, angle.height)

  form.reset();
  form.classList.add("hide")

  const id = generateId();

  // Bot Replies
  chat_container.innerHTML += chatStripe(true, "", id);
  chat_container.scrollTop = chat_container.scrollHeight;

  const message = document.getElementById(id) as HTMLElement;
  loader(message);

  async function fetchData(): Promise<any> {
    const response = await fetch("https://robocht.onrender.com/", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        prompt: data.get("prompt"),
      }),
    });

    clearInterval(loadInterval);
    message.innerHTML = "";

    if (!response.ok) {
      throw new Error(
        `Network response was not ok: ${response.status} - ${response.statusText}`
      );
    } else {
      const data = await response.json();
      const parsedData = data.bot.trim();
      typeText(message, parsedData);
    }
  }

  //Fetching data from server
  fetchData();
}


form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
});
