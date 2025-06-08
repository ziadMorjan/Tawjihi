import styled from "styled-components";

export const StyledTeachersPage = styled.div`

& section > div{
    display: flex;
    padding: 20px 0;
}



& .teachers{
    
    & div.teachers-list{
        /* background-color: aquamarine; */
        /* padding-top: 15px; */
        width: 100%;
        display: flex;
        gap: 2%;
        row-gap:15px;
        flex-wrap: wrap;
        justify-content:start;

    
        & > div{
            margin: 0;
            & img{
                width: 100%;

            & div{
                font-size: 5px;
                padding: 0px ;
                width: 100%;
            }
            
        }
        }
    }


        & div.pagination{
            display: flex;
            gap: 10px;
            justify-content: center;
            margin-top: 20px;

            & button {
                padding: 6px 12px;
                border: none;
                background-color: #ddd;
                cursor: pointer;
            }

            & button:disabled {
                background-color: #bbb;
                cursor: not-allowed;
            }
        }

    

}

`