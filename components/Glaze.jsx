import LiquidChrome from './LiquidChrome';

export default function Glaze() {
    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <LiquidChrome
                baseColor={[0.1, 0.1, 0.1]}
                speed={0.2}
                amplitude={1}
                interactive={false}
            />
        </div>

    )
}