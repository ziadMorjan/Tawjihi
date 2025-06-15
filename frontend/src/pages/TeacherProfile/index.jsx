import React from 'react'
import { useParams } from 'react-router-dom';
import { API_URL } from '../../config';
import { useProfileApi } from '../../hooks/useProfileApi';
import { LogoAndButton } from '../../components/LogoAndButton';
import { NavBar } from '../../layout/navBar';
import { Containers } from '../../components/Container';
import { H2, H3, H4, Pargrahph } from '../../components/typography';
import { TeacherProfileWraper } from './style';


function TeacherProfile() {

    const { id } = useParams(); //  the dynamic route param
    const { data, isLoading, error } = useProfileApi(`${API_URL}/users/${id}`);
    console.log(data.doc, 'from the profile')
    const profileData = data.doc;






    return (
        <TeacherProfileWraper>

            <LogoAndButton />
            <NavBar />

            <Containers >
                <section className='img-sec'>
                    <img src="data:image/webp;base64,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" alt="" />
                    <div>
                        <H2>{profileData?.name}</H2>
                        <Pargrahph>{profileData?.email}</Pargrahph>
                        <Pargrahph>{profileData?.phone}</Pargrahph>
                    </div>
                </section>

                <section className='about-sec'>
                    <H3>About</H3>
                    <Pargrahph>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus facilis maxime repellendus. Voluptatum, perspiciatis minima totam deleniti provident placeat qui autem officiis saepe ipsam, reprehenderit aspernatur! Veritatis velit quis officia. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Impedit hic quam repellendus excepturi officiis atque iure numquam nulla iusto voluptas, qui perspiciatis aliquid aspernatur ipsa iste perferendis! Sequi, cum sed!
                    Ut cupiditate adipisci minima deleniti tenetur ab, labore animi eum rem, suscipit quam placeat nihil aut quibusdam velit vitae error consequatur ipsum minus harum sequi sapiente qui dignissimos fuga. Nihil.
                    At voluptatibus modi deserunt quidem officiis necessitatibus magnam animi repudiandae fugiat nesciunt sapiente, adipisci sint sed impedit eligendi quos saepe incidunt ratione minima itaque omnis porro in aperiam. Culpa, aspernatur.</Pargrahph>
                </section>

                <section className='cv-sec'>
                    <H3>CV</H3>
                    <Pargrahph>Download CV</Pargrahph>
                    <a href={profileData?.cv} target="_blank" rel="noopener noreferrer"/>
                        <Pargrahph>Click here to download</Pargrahph>
                </section>
            </Containers>

        </TeacherProfileWraper>
    )
}

export default TeacherProfile