import { IShow } from '../../../../store/show';

interface Props {
  show: IShow;
}

function ShowItem({ show }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '0.5rem',
        opacity: show.id ? 1 : 0.5,
      }}
    >
      <img
        src={show.imgUrl || './logo192.png'}
        alt={`${show.title} cover`}
        width="24px"
        height="24px"
      />
      <input defaultValue={show.title} />
      <button>L</button>
      <div>
        <small>S: </small>
        <input type="number" defaultValue={show.season} min={0} max={99} />
      </div>
      <div>
        <small>E: </small>
        <input type="number" defaultValue={show.episode} min={0} max={99} />
      </div>
      <a href={show.url} target="_blank" rel="noreferrer">
        Watch now
      </a>
      <button>Delete</button>
    </div>
  );
}

export default ShowItem;
