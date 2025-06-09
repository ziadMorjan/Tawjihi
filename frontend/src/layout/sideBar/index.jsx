// Sidebar.jsx
import { SidebarContainer, SidebarHeader, CheckSection } from "./style";
import { CheckAndLabel } from "../../components/CheckAndLable";
import { Pargraph } from "../../components/typography/style";

const Sidebar = ({ courseNames = [], onFilterChange }) => {
  const handleCheckboxChange = (e) => {
    const { id, checked } = e.target;
    onFilterChange(id, checked);
  };

  return (
    <SidebarContainer>
      <SidebarHeader>التصنيفات</SidebarHeader>

      <Pargraph size="16px" style={{ color: "var(--color-link)" , fontSize:"18px" }}>
        الافرع
      </Pargraph>
      <CheckSection>
        {/* Note: filter values here are without "ال" for consistent normalization */}
        <CheckAndLabel
          text="العلمي"
          id="branch-علمي"
          onChange={handleCheckboxChange}
        />
        <CheckAndLabel
          text="الادبي"
          id="branch-ادبي"
          onChange={handleCheckboxChange}
        />
      </CheckSection>

      <Pargraph size="18px" style={{ color: "var(--color-link)" , fontSize:"18px" }}>
        الدورات
      </Pargraph>
      <CheckSection>
        <CheckAndLabel
          text="اللغة العربية"
          id="type-اللغة العربية"
          onChange={handleCheckboxChange}
        />
        <CheckAndLabel
          text="اللغة الإنجليزية"
          id="type-اللغة الإنجليزية"
          onChange={handleCheckboxChange}
        />
        <CheckAndLabel
          text="الرياضيات"
          id="type-الرياضيات"
          onChange={handleCheckboxChange}
        />
        <CheckAndLabel
          text="الفيزياء"
          id="type-الفيزياء"
          onChange={handleCheckboxChange}
        />
        <CheckAndLabel
          text="الكيمياء"
          id="type-الكيمياء"
          onChange={handleCheckboxChange}
        />
        <CheckAndLabel
          text="الأحياء"
          id="type-الأحياء"
          onChange={handleCheckboxChange}
        />
        <CheckAndLabel
          text="التاريخ"
          id="type-التاريخ"
          onChange={handleCheckboxChange}
        />
        <CheckAndLabel
          text="الجغرافيا"
          id="type-الجغرافيا"
          onChange={handleCheckboxChange}
        />
        <CheckAndLabel
          text="التربية الإسلامية"
          id="type-التربية الإسلامية"
          onChange={handleCheckboxChange}
        />
      </CheckSection>

      <Pargraph size="16px" style={{ color: "var(--color-link)" , fontSize:"18px" }}>
        السعر
      </Pargraph>
      <CheckSection>
        <CheckAndLabel
          text="مجاني"
          id="price-free"
          onChange={handleCheckboxChange}
        />
        <CheckAndLabel
          text="اقل من 50"
          id="price-50"
          onChange={handleCheckboxChange}
        />
        <CheckAndLabel
          text="اقل من 100"
          id="price-100"
          onChange={handleCheckboxChange}
        />
        <CheckAndLabel
          text="اقل من 200"
          id="price-200"
          onChange={handleCheckboxChange}
        />
        <CheckAndLabel
          text="اقل من 500"
          id="price-500"
          onChange={handleCheckboxChange}
        />
      </CheckSection>

      
    </SidebarContainer>
  );
};

export default Sidebar;
