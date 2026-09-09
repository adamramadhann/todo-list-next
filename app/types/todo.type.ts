// Bentuk satu baris todo — dipakai sebagai tipe OUTPUT di UI/client.
export type todoType = {
    id: string,
    text: string,
    completed: boolean,
    createdAt: Date,
    updatedAt: Date
}
