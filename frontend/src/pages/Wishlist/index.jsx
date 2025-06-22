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
//MUI library

//toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const WishList = () => {
  const { wishlist, setWishList } = useCRUD(); // ✅ استخدم wishList الصحيح

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`${API_URL}/wishlist`, {
          withCredentials: true,
        });
        setWishList(res.data.wishlist);
      } catch (e) {
        console.log(e);
      }
    };
    getData();
  }, [setWishList]);

  return (
    <div>
      <ToastContainer />

      <LogoAndButton />
      <NavBar />
      <Containers>

      <h2 style={{ textAlign: "center", margin: "16px" }}>قائمة المفضلة</h2>
      {wishlist.length === 0 ? (
        <p style={{ textAlign: "center" }}>لا توجد عناصر.</p>
      ) : (
        <div
        className="wishlist-grid"
        style={{ display: "flex", flexWrap: "wrap" }}
        >
          {wishlist.map((item) => (
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

export default WishList;
