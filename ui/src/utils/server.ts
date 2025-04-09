export async function fetchFromServer(endpoint: string, body: any): Promise<any> {
    try {
        const res = await fetch(`http://localhost:11434${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        if (!data) throw new Error("No response from server");
        return data;

    } catch (err) {
        console.error("Error fetching from server:", err);
        throw err;
    }
}