import styled from "styled-components";

export const PaginationsWraper = styled.div`

    & div.pagination {
      display: flex;
      gap: 10px;
      justify-content: center;
      margin-top: 20px;
      flex-wrap: wrap;

      & button {
        display: flex;
        justify-content: center;
        align-items: center;

        width: 30px;
        height: 30px;
        background-color: white;
        font-size: 16px;
        font-weight: 600;
        color: #1e3a8a;
        background-color: #f9f9f9;

        padding: 4px 12px;
        border-radius: 50%;
        display: inline-block;
        border: none;
        cursor: pointer;

        &.active-page{
            background-color: #e0f2fe;
        }

        & svg{
            transform: translateX(7px);

        }

    
      }


    }

`