import React, { useState } from 'react';
// style
import { StyledTeachersPage } from './style';

// Api url
import { API_URL } from '../../config';

// Layouts
import { NavBar } from '../../layout/navBar';
import Footer from '../../layout/footer';

// Hooks
import { useApi } from '../../hooks/useApi';

// Components
import { LogoAndButton } from '../../components/LogoAndButton';
import { Containers } from '../../components/Container';
import { TeacherCard } from '../../components/card/teacherCard';
import { CardSkeleton } from '../../components/Loading/LoadingCard';
import FilterMenuItem from '../../components/MenuItem/FilterMenuItem';
import { Pargrahph } from '../../components/typography';
import { PriceBadge } from '../../components/card/style';
import Paginations from '../../components/paginations';


function Teachers() {
  const { data = [], isLoading, error } = useApi(`${API_URL}/users/?role=teacher`);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <StyledTeachersPage>
      <LogoAndButton />
      <NavBar />
      
      <section>
        <Containers>
          <div className='num-of-pages'>
            <Pargrahph>  عرض الصفحة رقم<span>{currentPage}</span>من<span>{totalPages}</span></Pargrahph>
          </div>
          <div className='teachers'>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
            ) : error ? (
              <p>Error: {error.message}</p>
            ) : data.length === 0 ? (
              <p>.لا يوجد معلمين</p>
            ) : (
              <>
                {/* Teachers list */}
                <div className="teachers-list">
                  {currentItems.map((teacher, index) => (
                    <TeacherCard
                      key={index}
                      imgSrc={teacher.img || '/assets/img/logo.png'}
                      name={teacher.name}
                      starIcon={teacher.averageRating}
                    />
                  ))}
                </div>

                {/* Pagination buttons */}
                <Paginations currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage}/>
                
              </>
            )}
          </div>
        </Containers>
      </section>
      <Footer />
    </StyledTeachersPage>
  );
}

export default Teachers;
