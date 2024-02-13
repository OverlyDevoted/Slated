export async function getData(url, method = "GET", ...subdirectories) {
    const additional = subdirectories? subdirectories.join("/"):"";
    console.log(additional)
    const res = await fetch(url + additional, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        }
    });
    return await res.json();
}
