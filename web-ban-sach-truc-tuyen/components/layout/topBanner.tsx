import Image from "next/image";

export default function TopBanner(){
    return(
        <div className="bg-banner">
            <div className="contain-fluid px-0">
                <Image
                src="/images/banner/top-banner.jpg"
                alt="Khuyến mãi"
                width={1920}
                height={150}
                className="w-100"
                style={{
                    height:"auto",
                    maxHeight:"150px",
                    objectFit:"cover",
                }}
                priority
                />
            </div>
        </div>
    )
}