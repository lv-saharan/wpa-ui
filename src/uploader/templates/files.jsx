const { h, classNames } = wpa
import { formatSize, getFileType } from "../../utils";

export default ({ component }) => {
  let { files, selectText, multiple } = component.$props;
  return (
    <div className="files">
      <slot name="actions">
        <button
          className="btn btn-primary"
          onClick={() => {
            component.open();
          }}
        >
          {selectText}
        </button>
      </slot>
      <table class="table">
        <tbody>
          {files.map((file) => (
            <tr>
              <td>
                <wp-icon
                  view-box="1024"
                  name={getFileType(file.ext)}
                  type="file-type"
                ></wp-icon>
                {file.name}
                {file.ext}
              </td>
              <td>{formatSize(file.size)}</td>
              <td>
                <wp-icon name="delete" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
