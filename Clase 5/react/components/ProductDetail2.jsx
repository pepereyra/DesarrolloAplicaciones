import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProductDetail2 = () => {
    const {id} = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:3000/productos/${id}`);
                if (!response.ok) {
                    throw new Error('Producto no encontrado');
                }
                const data = await response.json();
                setProduct(data);    
            } catch (err) {
                console.error(err.message);
            }
        };

        fetchProduct();
    }, [id]);

    return (    
        <h1>{product.nombre}</h1>
    );

}

export default ProductDetail2;