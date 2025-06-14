import { useContext, useEffect } from "react";
import { SidebarContainer, SidebarHeader, CheckSection } from "./style";
import { CheckAndLabel } from "../../components/CheckAndLable";
import { Pargraph } from "../../components/typography/style";
import { SearchContext } from "../../context/SearchContext";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { SideBarContext } from "../../context/SideBarContext";
import { Box } from "@mui/material";

import { API_URL } from "../../config";
import { useApi } from "../../hooks/useApi";

const normalizeArabic = (str) => {
  if (!str) return "";
  return str.startsWith("ال") ? str.slice(2) : str;
};

const Sidebar = ({ onFilterChange }) => {
  const { search ,setSearch } = useContext(SearchContext);
  const normalizedSearch = normalizeArabic(search?.toLowerCase() || "");

  let { data: subject ,isLoading } = useApi(`${API_URL}/subjects`);
  subject = subject.map((item) => item.name);

  let { data: branch } = useApi(`${API_URL}/branches`);
  branch = branch.map((item) => item.name);

  console.log(branch);

  const allInputs = [
    // { id: "branch-علمي", label: "علمي" },
    // { id: "branch-ادبي", label: "ادبي" },

    branch.map((label) => ({
      id: `branch-${normalizeArabic(label)}`,
      label: `${label}`,
    })),

    subject.map((label) => ({ id: `subject-${label}`, label })),
    ...["free", "50", "100", "200", "500"].map((price) => ({
      id: `price-${price}`,
      label: price === "free" ? "مجاني" : price,
    })),
  ];

  useEffect(() => {
    allInputs.forEach(({ id, label }) => {
      if (
        normalizedSearch &&
        normalizeArabic(label).includes(normalizedSearch)
      ) {
        onFilterChange(id, true);
      }
    });
    
  }, [normalizedSearch ]);

  const handleCheckboxChange = (e) => {
    const { id, checked } = e.target;
    onFilterChange(id, checked);
    console.log(id);
  };

  const isMatched = (label) =>
    normalizedSearch &&
    normalizeArabic(label.toLowerCase()).includes(normalizedSearch);

  const { isOpen, setIsOpen } = useContext(SideBarContext);

  const onCancel = () => setIsOpen(false);

  return (
    <>
      {/* Toggle Button Wrapper with Smooth Transition */}
      <Box
        sx={{
          position: "absolute",
          top: "220px",
          right: isOpen ? "220px" : "-10px",
          zIndex: 10001,
          transition: "right 0.4s ease",
          display: { xs: "block", sm: "none" },
        }}
      >
        {isOpen ? (
          <ChevronRightIcon
            onClick={() => setIsOpen(false)}
            sx={{
              cursor: "pointer",
              border: "1px solid var(--color-primary)",
              color: "var(--color-primary)",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              backgroundColor: "#fff",
              padding: "4px",
            }}
          />
        ) : (
          <ChevronLeftIcon
            onClick={() => setIsOpen(true)}
            sx={{
              cursor: "pointer",
              border: "1px solid var(--color-primary)",
              color: "var(--color-primary)",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              backgroundColor: "#fff",
              padding: "4px",
            }}
          />
        )}
      </Box>

      {isOpen && <div className="modal-overlay" onClick={onCancel} />}
      <SidebarContainer isOpen={isOpen}>
        <SidebarHeader>التصنيفات</SidebarHeader>

        <Pargraph style={{ color: "var(--color-link)", fontSize: "18px" }}>
          الافرع
        </Pargraph>
        {isLoading ? (
          "loading..."
        ) : (
          <CheckSection>
            {branch.map((label) => (
              <CheckAndLabel
                key={label}
                text={label}
                id={`branch-${normalizeArabic(label)}`}
                onChange={handleCheckboxChange}
                defaultChecked={isMatched(label)}
              />
            ))}
          </CheckSection>
        )}

        <Pargraph style={{ color: "var(--color-link)", fontSize: "18px" }}>
          المواد
        </Pargraph>
        {isLoading ? "loading..." :
        
        <CheckSection>
          {subject.map((label) => (
            <CheckAndLabel
            key={label}
            text={label}
            id={`subject-${label}`}
            onChange={handleCheckboxChange}
            defaultChecked={isMatched(label)}
            />
          ))}
        </CheckSection>
        }

        <Pargraph style={{ color: "var(--color-link)", fontSize: "18px" }}>
          السعر
        </Pargraph>
        <CheckSection>
          {[
            { id: "price-free", label: "مجاني" },
            { id: "price-50", label: "اقل من 50" },
            { id: "price-100", label: "اقل من 100" },
            { id: "price-200", label: "اقل من 200" },
            { id: "price-500", label: "اقل من 500" },
          ].map(({ id, label }) => (
            <CheckAndLabel
              key={id}
              text={label}
              id={id}
              onChange={handleCheckboxChange}
              defaultChecked={isMatched(label)}
            />
          ))}
        </CheckSection>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;
