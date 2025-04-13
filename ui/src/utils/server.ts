const isDev = true;

export async function fetchFromServer(endpoint: string, body: any): Promise<any> {

    // TODO: Remove this
    if (isDev) {
        // Mock response for development
        return {
            "reply": "This is a mock response from the server.",
            "edit_summary": "This is a mock edit summary.",
            "updated_doc": "This is a mock updated document.",
        };
    }

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