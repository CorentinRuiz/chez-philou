import BackgroundVideo from '../ressources/preparation_commande.mp4';

export const PreparationInProgress = () => {
    return (
        <div>
            <video autoPlay loop muted id='video' style={{width: '100%', height: '100%'}}>
                <source src={BackgroundVideo} type='video/mp4'/>
            </video>
        </div>
    );
}