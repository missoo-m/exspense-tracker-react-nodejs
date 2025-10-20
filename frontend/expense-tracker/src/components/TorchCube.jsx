// src/components/TorchCube.jsx

import './TorchCube.css'; // 🔥 Импорт CSS, содержащий всю магию 3D и анимации

const TorchCube = () => {
    return (
        // 🔥 ИСПРАВЛЕНО: Flex-контейнер настроен на вертикальное расположение (flex-col) 
        // и распределение пространства (justify-between)
        <div className="p-6 bg-gray-800 rounded-2xl shadow-xl flex flex-col justify-between items-center h-96 relative"> 
            
            {/* 1. ГРУППА ФАКЕЛА И ЕГО ТЕКСТА: Занимает большую часть места */}
            {/* flex-grow позволяет этой группе растянуться и отодвинуть рекламу вниз */}
            <div className="flex-grow w-full flex justify-center items-start pt-8">
                <label className="container" htmlFor="torch-checkbox">
                    {/* 1. Скрытый чекбокс для интерактива */}
                    <input type="checkbox" id="torch-checkbox" />
                    
                    <div className="torch">
                        {/* 2. Эффекты */}
                        <div className="light-effect"></div>
                        <div className="glow-effect"></div>
                        
                        <div className="particles">
                            <span></span><span></span><span></span><span></span>
                            <span></span><span></span><span></span><span></span>
                        </div>
                        <div className="smoke">
                            <span></span><span></span><span></span><span></span>
                        </div>
                        
                        {/* 3. Голова (Head) - Источник огня */}
                        <div className="head">
                            <div className="face top"><div></div><div></div><div></div><div></div></div>
                            <div className="face left"><div></div><div></div><div></div><div></div></div>
                            <div className="face right"><div></div><div></div><div></div><div></div></div>
                        </div>
                        
                        {/* 4. Рукоять (Stick) */}
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

                    {/* 5. Текст "Click to light" (позиционируется относительно label) */}
                    <div className="simple-text">Click to light</div>
                
                </label>
            </div>
           
           {/* 2. РЕКЛАМНЫЙ ТЕКСТ: Прижат к самому низу */}
            <div className="w-full text-center pb-2"> 
                 <p className="text-white text-xs font-light tracking-wider opacity-60">
                    * Здесь могла быть ваша реклама
                 </p>
            </div>
        </div>
    );
};

export default TorchCube;