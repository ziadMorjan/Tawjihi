import { SidebarContainer, SidebarHeader, CheckSection } from "./style";
import { CheckAndLabel } from "../../components/CheckAndLable";
import { Pargraph } from "../../components/typography/style";

const Sidebar = ({ branches, courses, prices, selectedFilters, onFilterChange, onReset }) => {
  const renderSection = (title, items) => (
    <>
      <Pargraph size="16px" style={{ color: "var(--color-link)" }}>
        {title}
      </Pargraph>
      <CheckSection>
        {items.map(({ id, text }) => (
          <CheckAndLabel
            key={id}
            id={id}
            text={text}
            checked={selectedFilters.includes(id)}
            onChange={onFilterChange}
          />
        ))}
      </CheckSection>
    </>
  );

  return (
    <SidebarContainer>
      <SidebarHeader>التصنيفات</SidebarHeader>
      <button
        style={{
          marginBottom: "1rem",
          background: "#d9534f",
          color: "#fff",
          padding: "0.4rem 1rem",
          borderRadius: "4px",
          cursor: "pointer",
          border: "none",
        }}
        onClick={onReset}
      >
        إعادة تعيين الفلاتر
      </button>
      {renderSection("الافرع", branches)}
      {renderSection("الدورات", courses)}
      {renderSection("السعر", prices)}
    </SidebarContainer>
  );
};

export default Sidebar;
