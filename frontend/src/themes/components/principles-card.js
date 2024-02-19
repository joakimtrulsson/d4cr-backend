import "../sources/scss/components/principles-card.scss";
import "../sources/scss/base/utils.scss";
import Image from "next/image";
import PlaceHolder from "../sources/assets/graphics/placeholder/dummy-image5.png";
import ArrowRight from "../sources/assets/graphics/icons/arrow-right.svg";

const PrinciplesCard = ({ type, title, url }) => {
  
  return (

    <div
      className={`principles-card flex flex-row
            bg-yellow-50 borderradius--xs`}
    > 
      <Image className="img-size" src={PlaceHolder} alt="" />
      
      <div className="text-container">
        <div className="title-text">
          <a className="no-decoration " href={url}>
            <h4 className="color-grey-700 text-overflow">
              {title}
            </h4>
          </a>
        </div>

        <div className="arrow-text">
          <a href={url}>
            Learn more
            <Image className="arrow-right" src={ArrowRight} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default PrinciplesCard;