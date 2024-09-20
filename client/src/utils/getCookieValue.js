function getCookieValue(name) {
    let cookies = document.cookie;

    let cookiesArray = cookies.split(';');

    for (let i = 0; i < cookiesArray.length; i++) {
        let cookie = cookiesArray[i].trim();

        if (cookie.indexOf(name + '=') === 0) {
            return cookie.substring(name.length + 1);
        }
    }

    return null;
}

export default getCookieValue;