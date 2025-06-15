import { useContext, useEffect } from "react";
import { useCRUD } from "../../hooks/useCRUD";
import { Card } from "../../components/card/courseCard";
import axios from "axios";
import { API_URL } from "../../config";
import { Alert, Snackbar } from "@mui/material";
import { WishListContext } from "../../context/WishListContext";

const WishList = () => {
  const { wishlist, setWishList } = useCRUD();

  const { showAlertWishList, setShowAlertWishList } =
    useContext(WishListContext);

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
      <Snackbar
        open={showAlertWishList}
        autoHideDuration={3000}
        onClose={() => setShowAlertWishList(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity="success"
          onClose={() => setShowAlertWishList(false)}
          sx={{
            width: "400px",
            height: "80px",
            display: "flex",
            alignItems: "center",
            fontSize: "1.2rem",
          }}
        >
          تم ازالة الدورة من المفضلة{" "}
        </Alert>
      </Snackbar>

      <h2 style={{ textAlign: "center", margin: "16px" }}>قائمة الأمنيات</h2>
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
    </div>
  );
};

export default WishList;
