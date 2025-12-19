import React from 'react';
import Header from "../components/Header";
import Footer from '../components/Footer';
import FindProfessionalHero from '../components/FindProfessionalHero';
import FindProfessional from '../components/FindProfessional';

const FindProfessionalPage: React.FC = () => {
    return (
        <div>
            <Header />
            <FindProfessionalHero />
            <FindProfessional />
            <Footer />
        </div>
    );
};

export default FindProfessionalPage;
