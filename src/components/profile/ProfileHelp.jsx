import { useNavigate } from "react-router-dom";

export default function ProfileHelp() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("../", { replace: true });
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="px-12">
        <p>Please contact RefugeeOne team directly for any queries.</p>
        <p className="font-bold mt-4">Address</p>
        <p>
          RefugeeOne6008 <br />
          N. California Ave. <br />
          Chicago IL 60659 <br />
        </p>
        <p className="font-bold mt-4">Contact</p>
        <p>
          phone: <a href="tel:7739895647">(773) 989-5647</a> <br />
          fax: <a href="tel:7739890484">(773) 989-0484</a> <br />
        </p>
        <a href="mailto:info@refugeeone.org">info@refugeeone.org</a>
        <p className="font-bold mt-4">Website</p>
        <a href="https://www.refugeeone.org/" rel="nofollow noreferrer">
          www.refugeeone.org
        </a>
        <p className="font-bold mt-4">Office Hours</p>
        <p>8:30 a.m. – 4:30 p.m Monday – Friday</p>
      </div>
      <div className="m-2 flex flex-col md:flex-row md:gap-4 justify-center">
        <button className="btn btn-xs btn-md lg:btn-lg m-2" onClick={handleBack}>
          Back
        </button>
      </div>
    </div>
  );
}
