//style
import { SidebarContainer, SidebarHeader, CheckSection } from "./style";

//components
import { CheckAndLabel } from "../../components/CheckAndLable";
import { Pargraph } from "../../components/typography/style";

const Sidebar = () => {
  return (
    <SidebarContainer>
      <SidebarHeader>التصنيفات</SidebarHeader>
      <Pargraph size="16px" style={{ color: "var(--color-link)" }}>
        الافرع{" "}
      </Pargraph>
      <CheckSection>
        <CheckAndLabel text="العلمي" id="optA" />
        <CheckAndLabel text="الأدبي" id="optB" />
      </CheckSection>

      <Pargraph size="16px" style={{ color: "var(--color-link)" }}>
        الدورات{" "}
      </Pargraph>

      <CheckSection>
        <CheckAndLabel text="اللغة العربية" id="optA" />
        <CheckAndLabel text="اللغة الإنجليزية" id="optB" />
        <CheckAndLabel text="الرياضيات" id="optC" />
        <CheckAndLabel text="الفيزياء" id="optD" />
        <CheckAndLabel text="الكيمياء" id="optE" />
        <CheckAndLabel text="الأحياء" id="optF" />
        <CheckAndLabel text="التاريخ" id="optG" />
        <CheckAndLabel text="الجغرافيا" id="optH" />
        <CheckAndLabel text="التربية الإسلامية" id="optI" />
      </CheckSection>

      <Pargraph size="16px" style={{ color: "var(--color-link)" }}>
        السعر{" "}
      </Pargraph>

      <CheckSection>
        <CheckAndLabel text="مجاني " id="optA" />
        <CheckAndLabel text="اقل من 50 " id="optB" />
        <CheckAndLabel text="اقل من 100 " id="optC" />
        <CheckAndLabel text="اقل من 200 " id="optD" />
        <CheckAndLabel text="اقل من 500 " id="optE" />
      </CheckSection>
    </SidebarContainer>
  );
};

export default Sidebar;
