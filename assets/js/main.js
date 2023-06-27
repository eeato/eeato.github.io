/**
 * Easy selector helper function
 */
const select = (el, all = false) => {
  el = el.trim();
  if (all) {
    return [...document.querySelectorAll(el)];
  } else {
    return document.querySelector(el);
  }
};

/**
 * Easy event listener function
 */
const on = (type, el, listener, all = false) => {
  let selectEl = select(el, all);
  if (selectEl) {
    if (all) {
      selectEl.forEach((e) => e.addEventListener(type, listener));
    } else {
      selectEl.addEventListener(type, listener);
    }
  }
};

/**
 * Easy on scroll event listener
 */
const onscroll = (el, listener) => {
  el.addEventListener("scroll", listener);
};
/**
 * Scrolls to an element with header offset
 */
const scrollto = (el) => {
  let header = select("#header");
  let offset = header.offsetHeight;

  if (!header.classList.contains("header-scrolled")) {
    offset -= 16;
  }

  let elementPos = select(el).offsetTop;
  window.scrollTo({
    top: elementPos - offset,
    behavior: "smooth",
  });
};


function notify(msg, classes = ['text-white'], container = document.body) {
  let p = document.createElement('p');
  p.innerHTML = msg;
  classes.push('toast');
  classes.forEach((v,k,pa) => {
    p.classList.add(v);
  })
  container.appendChild(p);
  window.setTimeout(() => {
    p.style.bottom = "-50px";
    p.style.opacity = "0.2";
    window.setTimeout(() => {
      p.remove();
    }, 2000);
  }, 6000);
}


on("change", '.upload_images', (e) => {

  const file = e.target.files[0];
  console.log(file);
  if (!file) {
    return;
  }

  new Compressor(file, {
    quality: 0.2,
    // The compression process is asynchronous,
    // which means you have to access the `result` in the `success` hook function.
    success(result) {
      e.target.files[0] = result;
      console.log(result);

    },
    error(err) {
      console.log(err.message);
      notify(err.message);
    },
  });

}, true);
