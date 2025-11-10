
import './TorchCube.css'; 

const TorchCube = () => {
    return (
        <div className="p-6 bg-gray-800 rounded-2xl shadow-xl flex flex-col justify-between items-center h-96 relative"> 
            
            <div className="flex-grow w-full flex justify-center items-start pt-8">
                <label className="container" htmlFor="torch-checkbox">
                    <input type="checkbox" id="torch-checkbox" />
                    
                    <div className="torch">
                        <div className="light-effect"></div>
                        <div className="glow-effect"></div>
                        
                        <div className="particles">
                            <span></span><span></span><span></span><span></span>
                            <span></span><span></span><span></span><span></span>
                        </div>
                        <div className="smoke">
                            <span></span><span></span><span></span><span></span>
                        </div>
                        
                        <div className="head">
                            <div className="face top"><div></div><div></div><div></div><div></div></div>
                            <div className="face left"><div></div><div></div><div></div><div></div></div>
                            <div className="face right"><div></div><div></div><div></div><div></div></div>
                        </div>
                        
                        <div className="stick">
                            <div className="side side-left">
                                <div></div><div></div><div></div><div></div>
                                <div></div><div></div><div></div><div></div>
                                <div></div><div></div><div></div><div></div>
                                <div></div><div></div><div></div><div></div>
                            </div>
                            <div className="side side-right">
                                <div></div><div></div><div></div><div></div>
                                <div></div><div></div><div></div><div></div>
                                <div></div><div></div><div></div><div></div>
                                <div></div><div></div><div></div><div></div>
                            </div>
                        </div>
                    </div>

                    <div className="simple-text">Click to light</div>
                
                </label>
            </div>
           
            <div className="w-full text-center pb-2"> 
                 <p className="text-white text-xs font-light tracking-wider opacity-60">
                    * Здесь могла быть ваша реклама
                 </p>
            </div>
        </div>
    );
};

export default TorchCube;