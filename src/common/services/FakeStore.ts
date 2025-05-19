import * as CustomError from "@common/services/CustomError";

export class Fakestore {
    baseUrl:string = 'https://fakestoreapi.com/products';

    async getAllProducts(): Promise<any> {
        const response = await fetch(this.baseUrl);
        if (!response.ok) {
           throw new CustomError.NetworkError('Network response was not ok: '+ response.statusText);
        }
        const data = response.json();
        return data;
    }
    async getProductById(id: number): Promise<any> {
        const response = await fetch(`${this.baseUrl}/${id}`);
        if (!response.ok) {
            throw new CustomError.NetworkError('Network response was not ok: '+ response.statusText);
        }
        const data = response.json();
        return data;
    }
}
