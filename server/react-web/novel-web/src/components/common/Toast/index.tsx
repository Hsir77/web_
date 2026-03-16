import style from "./index.module.css";

let toastContainer: HTMLDivElement | null = null;

function createToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.className = style.toastContainer;
    document.body.appendChild(toastContainer);
  }
}

function showToast(message: string, type: "success" | "error") {
  createToastContainer();

  const toast = document.createElement("div");

  toast.className =
    type === "success" ? style.successToast : style.errorToast;

  toast.innerText = message;

  toastContainer!.appendChild(toast);

  // 动画出现
  requestAnimationFrame(() => {
    toast.classList.add(style.show);
  });

  // 2秒后消失
  setTimeout(() => {
    toast.classList.remove(style.show);

    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 2000);
}

export const Toast = {
  success(message: string) {
    showToast(message, "success");
  },

  error(message: string) {
    showToast(message, "error");
  }
};