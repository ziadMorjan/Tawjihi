import React, { useState } from 'react';
import { StyledTeachersPage } from './style';
import { LogoAndButton } from '../../components/LogoAndButton';
import { Containers } from '../../components/Container';
import { TeacherCard } from '../../components/card/teacherCard';
import { useApi } from '../../hooks/useApi';
import { API_URL } from '../../config';
import { NavBar } from '../../layout/navBar';
import Footer from '../../layout/footer';
import { CardSkeleton } from '../../components/Loading/LoadingCard';

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
                <div className="pagination">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      disabled={index + 1 === currentPage}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
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
