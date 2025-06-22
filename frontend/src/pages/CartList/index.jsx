//react
import { useEffect } from "react";

//hooks
import { useCRUD } from "../../hooks/useCRUD";

//components
import { Card } from "../../components/card/courseCard";
import { Containers } from "../../components/Container";

//axios
import axios from "axios";
//URL
import { API_URL } from "../../config";
import { LogoAndButton } from "../../components/LogoAndButton";
import { NavBar } from "../../layout/navBar";
import { ModalTeacher } from "../../components/modalTeacher";
import { CartHeader } from "../../components/cartHeader";

//toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "../../components/Buttons/button";
import { LoginAndRegisterButton } from "../../components/loginButtonAndRegister";

const CartList = () => {
  const { cart, setCartList } = useCRUD();

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`${API_URL}/cart`, {
          withCredentials: true,
        });
        setCartList(res.data.cart.courses);
      } catch (e) {
        console.log(e);
      }
    };
    getData();
  }, [setCartList]);

  return (
    <div>
      <ToastContainer />

      <LogoAndButton />
      <NavBar />
      <ModalTeacher />
<<<<<<< HEAD
      <Containers>

      <h2 style={{ textAlign: "center", margin: "16px" }}>قائمة السلة</h2>
=======
      
      <CartHeader>
          <h2 style={{ textAlign: "center", margin: "16px" }}>قائمة السلة</h2>
        <LoginAndRegisterButton fontSize={18}>شراء الكل</LoginAndRegisterButton>
      </CartHeader>
        
      

>>>>>>> 71b473789d2b302af1ea71c0a602a704694a6175
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
            </Containers>
    </div>
  );
};

export default CartList;
