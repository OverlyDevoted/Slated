export async function getData(url, method = "GET", body = null) {
    const res = await fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: body
    });
    return await res.json();
}
