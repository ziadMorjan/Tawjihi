import styled from "styled-components";

export const TeacherProfileWraper = styled.div`

.img-sec{
     display: flex;
     gap: 3%;

     & img{
        width: 200px;
        height: 200px;
        border-radius: 15%;
        border: none;
        object-fit: cover;

     }

     & div{
        display: flex;
        flex-direction: column;
        justify-content: center;

        & p{
            margin: 0 !important;
            padding: 0;
        }
    
     }
}

& section{
   padding: 20px 10px;
  
}
h3{
      color: red;  
   }



`