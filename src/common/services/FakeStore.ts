export class Fakestore {
    baseUrl:string = 'https://fakestoreapi.com/products';


    async getAllProducts(): Promise<any> {
        const response = await fetch(this.baseUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    }
    async getProductById(id: number): Promise<any> {
        const response = await fetch(`${this.baseUrl}/${id}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    }
}
