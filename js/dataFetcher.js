export async function getData(url) {
    const res = await fetch(url);
    return await res.json();
}
