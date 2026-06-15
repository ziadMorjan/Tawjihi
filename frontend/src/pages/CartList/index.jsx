import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2, Tag } from "lucide-react";
import { MainLayout } from "../../shared/components/layout/MainLayout";
import { Button, Input, Badge, Spinner } from "../../shared/components";
import { StarRating } from "../../features/courses/components/CourseCard/StarRating";
import { useCart } from "../../features/cart";
import { useCartActions } from "../../features/cart";
import {
  PageWrapper,
  PageTitle,
  CartGrid,
  CartItems,
  CartItem,
  ItemImage,
  ItemInfo,
  ItemTitle,
  ItemTeacher,
  ItemPrice,
  RemoveBtn,
  SummaryCard,
  SummaryTitle,
  SummaryRow,
  CouponRow,
  EmptyState,
  EmptyTitle,
  EmptyText,
} from "./CartList.styles";

export default function CartList() {
  const navigate = useNavigate();
  const { cartItems, totalPrice, totalPriceAfterDiscount, isLoading } =
    useCart();
  const {
    removeFromCart,
    clearCart,
    applyCoupon,
    checkout,
    isRemoveLoading,
    isClearLoading,
    isCouponLoading,
    isCheckoutLoading,
    couponError,
  } = useCartActions();

  const [couponCode, setCouponCode] = useState("");

  // // السعر الفعلي للكورسات (بعد خصم الكورسات الفردية، قبل الكوبون)
  // const displayPrice = cartItems.reduce((sum, course) => {
  //   const p = course?.priceAfterDiscount ?? course?.price ?? 0;
  //   return sum + p;
  // }, 0);

  // خصم الكورسات نفسها (مقارنة بالسعر الأصلي في totalPrice)
  // const courseDiscount = totalPrice - displayPrice;

    // السعر الفعلي للكورسات (بعد خصم الكورسات الفردية، قبل الكوبون)
  const displayPrice = cartItems.reduce((sum, course) => {
    const p = course?.priceAfterDiscount ?? course?.price ?? 0;
    return sum + p;
  }, 0);

  // خصم الكورسات نفسها (مقارنة بالسعر الأصلي في totalPrice)
  const courseDiscount = totalPrice - displayPrice;

  // نسبة خصم الكوبون (محسوبة على totalPrice الأصلي)
  // نطبقها على displayPrice (بعد خصم الكورسات) للحصول على السعر الصحيح
  let finalPrice = displayPrice;
  let couponDiscount = 0;
  if (totalPriceAfterDiscount !== null && totalPrice > 0) {
    const couponDiscountRatio = (totalPrice - totalPriceAfterDiscount) / totalPrice;
    finalPrice = displayPrice * (1 - couponDiscountRatio);
    couponDiscount = displayPrice - finalPrice;
  }



  if (isLoading) {
    return (
      <MainLayout>
        <PageWrapper>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "80px",
            }}
          >
            <Spinner size="lg" />
          </div>
        </PageWrapper>
      </MainLayout>
    );
  }

  if (!cartItems.length) {
    return (
      <MainLayout>
        <PageWrapper>
          <EmptyState>
            <ShoppingCart size={64} />
            <EmptyTitle>سلتك فارغة</EmptyTitle>
            <EmptyText>لم تضف أي كورسات بعد</EmptyText>
            <Button onClick={() => navigate("/courses")}>تصفح الكورسات</Button>
          </EmptyState>
        </PageWrapper>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageWrapper>
        <PageTitle>
          سلة المشتريات
          <Badge variant="primary" style={{ marginRight: 12, fontSize: 14 }}>
            {cartItems.length} كورس
          </Badge>
        </PageTitle>

        <CartGrid>
          <CartItems>
            {cartItems.map((course) => {
              const id = course?._id ?? course;
              const name = course?.name ?? "كورس";
              const img = course?.img ?? "/assets/img/logo.png";
              const teacher = course?.teacher;
              const rating = course?.averageRating ?? 0;

              // استخراج السعر الحالي (المخفض) والسعر القديم (الأصلي)
              const currentPrice =
                course?.priceAfterDiscount ?? course?.price ?? 0;
              const oldPrice = course?.priceAfterDiscount
                ? course?.price
                : null;

              return (
                <CartItem key={id}>
                  <ItemImage onClick={() => navigate(`/courses/${id}`)}>
                    <img src={img} alt={name} loading="lazy" />
                  </ItemImage>
                  <ItemInfo>
                    <ItemTitle onClick={() => navigate(`/courses/${id}`)}>
                      {name}
                    </ItemTitle>
                    {teacher?.name && <ItemTeacher>{teacher.name}</ItemTeacher>}
                    {rating > 0 && <StarRating rating={rating} />}

                    {/* تعديل عرض السعر هنا */}
                    <ItemPrice>
                      {currentPrice === 0 ? (
                        <Badge variant="success">مجاني</Badge>
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <span style={{ fontWeight: "bold" }}>
                            {currentPrice} ₪
                          </span>
                          {oldPrice && (
                            <span
                              style={{
                                textDecoration: "line-through",
                                fontSize: "14px",
                                color: "#94A3B8",
                              }}
                            >
                              {oldPrice} ₪
                            </span>
                          )}
                        </div>
                      )}
                    </ItemPrice>
                  </ItemInfo>
                  <RemoveBtn
                    onClick={() => removeFromCart(id)}
                    disabled={isRemoveLoading}
                  >
                    <Trash2 size={14} /> حذف
                  </RemoveBtn>
                </CartItem>
              );
            })}
            {cartItems.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearCart()}
                isLoading={isClearLoading}
                style={{ alignSelf: "flex-start", color: "#DC2626" }}
              >
                تفريغ السلة
              </Button>
            )}
          </CartItems>

          <SummaryCard>
            <SummaryTitle>ملخص الطلب</SummaryTitle>

            <SummaryRow>
              <span>سعر الكورسات ({cartItems.length})</span>
              <span>{totalPrice} ₪</span>
            </SummaryRow>

            {courseDiscount > 0 && (
              <SummaryRow>
                <span>خصم الكورسات</span>
                <span style={{ color: "#16A34A" }}>-{courseDiscount.toFixed(2)} ₪</span>
              </SummaryRow>
            )}

            {couponDiscount > 0 && (
              <SummaryRow>
                <span>خصم الكوبون</span>
                <span style={{ color: "#16A34A" }}>
                  -{couponDiscount.toFixed(2)} ₪
                </span>
              </SummaryRow>
            )}

            <SummaryRow className="total">
              <span>الإجمالي</span>
              <span>{finalPrice.toFixed(2)} ₪</span>
            </SummaryRow>

            <CouponRow>
              <Input
                placeholder="كود الخصم"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                leftIcon={<Tag size={16} />}
                error={couponError?.response?.data?.message}
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => applyCoupon(couponCode)}
                isLoading={isCouponLoading}
                disabled={!couponCode.trim()}
                style={{ flexShrink: 0 }}
              >
                تطبيق
              </Button>
            </CouponRow>

            <Button
              fullWidth
              size="lg"
              isLoading={isCheckoutLoading}
              onClick={() => {
                const ids = cartItems.map((item) => item?._id ?? item);
                checkout(ids);
              }}
            >
              إتمام الشراء — {finalPrice.toFixed(2)} ₪
            </Button>

            <p
              style={{
                fontSize: 12,
                color: "#94A3B8",
                textAlign: "center",
                margin: 0,
              }}
            >
              دفع آمن عبر Stripe
            </p>
          </SummaryCard>
        </CartGrid>
      </PageWrapper>
    </MainLayout>
  );
}
