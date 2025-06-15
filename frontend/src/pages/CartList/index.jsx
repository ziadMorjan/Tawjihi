//react
import {useEffect } from "react";

//hooks
import { useCRUD } from "../../hooks/useCRUD";

//components
import { Card } from "../../components/card/courseCard";

//axios
import axios from "axios";
//URL
import { API_URL } from "../../config";

const CartList = () => {
  const { cart, setCartList } = useCRUD(); // ✅ هنا setCartList مش setCart

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`${API_URL}/cart`, {
          withCredentials: true,
        });
        console.log("Cart data:", res.data.cart); // ✅ التأكد من بيانات السلة
        setCartList(res.data.cart.courses); // ✅ التأكد من وضع بيانات السلة
      } catch (e) {
        console.log(e);
      }
    };
    getData();
  }, [setCartList]);

  return (
    <div>
      <h2 style={{ textAlign: "center", margin: "16px" }}>قائمة السلة</h2>
      {cart.length === 0 ? (
        <p style={{ textAlign: "center" }}>لا توجد عناصر.</p>
      ) : (
        <div
          className="cart-grid"
          style={{ display: "flex", flexWrap: "wrap" }}
        >
          {cart.map((item) => (
            <Card
              key={item._id}
              item={item}
              id={item._id}
              imgSrc={item.img || "/assets/img/logo.png"}
              name={item.name}
              starIcon={item.averageRating}
              price={item.price}
              priceAfterDiscount={item.priceAfterDiscount}
              teacherName={item.teacher?.name}
              teacherImg={item.teacher?.img || "/assets/img/logo.png"}
              branch={item.branches.map((b) => b.name).join(" | ")}
              subject={item.subject?.name}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CartList;
