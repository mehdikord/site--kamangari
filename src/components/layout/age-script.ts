export const AGE_KEY = "kamangiri-age";

/** Runs in <head> before the first paint. */
export const ageScript = `try{if(localStorage.getItem("${AGE_KEY}")==="ok")document.documentElement.dataset.age="ok"}catch(e){}`;
