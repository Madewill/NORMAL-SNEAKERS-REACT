import React, { useEffect } from 'react';
import logo from '../../public/assets/images/logo.svg';
import Img1 from '../../public/assets/images/warmup-1.jpg';
import Img2 from '../../public/assets/images/warmup-2.jpg';
import Img3 from '../../public/assets/images/warmup-3.jpg';
import main from '../Functionality/main.js'; // Importing your app.js file



const Hero = () => {

    useEffect(() => {
        main();
      }, []);


    return (
        <>
            <section className="sneaker">
                {/* <!-- this is where Three.js lives --> */}
            </section>

            <section className="new-drop">
                <img src={logo} alt="New Drop" />
            </section>

            <section className="content">
                <img src={Img1} alt="Photo" />

                <p>
                    In a world inundated with flashy designs and over-the-top branding, Normal Sneakers emerges
                    as a breath of fresh air, prioritizing minimalistic elegance and unparalleled comfort.
                </p>
            </section>

            <section className="content">
                <p>
                    Merging traditional craftsmanship with innovative technology, our newest sneaker release
                    promises not just footwear, but a lifestyle choice for those who value understated
                    sophistication and everyday functionality.
                </p>

                <img src={Img2} alt="Photo" />
            </section>

            <section className="content">
                <img src={Img3} alt="Photo" />

                <p>
                    Join us in celebrating a return to the essentials and stepping into a new era of footwear.
                    Welcome to the Normal revolution.
                </p>
            </section>
            {/* <AppJS /> */}

        </>
    )
}

export default Hero