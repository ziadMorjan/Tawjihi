import styled from "styled-components";

export const TeacherProfileWraper = styled.div`

   & hr{
      width: 60%;
      margin: 0 auto;
      border-color:rgb(0,0,0, 0.13)
      
   }

.img-sec{
   /* background-color: var(--color-primary); */

   &>div{
      padding: 20px 0;
     display: flex;
     gap: 3%;

     & img{
        width: 200px;
        height: 200px;
        border-radius: 50%;
        box-shadow:0px 0px 14px 5px rgba(0, 123, 255, 0.3);
        border: none;
        object-fit: cover;
        transition: box-shadow 0.3s ease;

        &:hover{
        box-shadow: 0px 0px 14px 11px rgba(0, 123, 255, 0.3);
        }

     }

     & div{
        display: flex;
        flex-direction: column;
        justify-content: center;

        & h2{
           color: var(--color-link);
           font-size: 23px;
        }

        & p{
            margin: 0 !important;
            padding: 0;
            color:var(--color-text);
            
            
        }
    
     }
}}

& section{
   padding: 20px 10px;
   & h3{
      color: var(--color-link-hover);
      font-size: 22px;
      margin-bottom: 20px;
   }
  
}

& .about-sec{
  & p{
   font-size: 15px;
  }
}

h3{
      color: red;  
   }



`