import React from "react";

export default function CrudModal({ title, fields, model, setModel, onSave, onClose }) {
  const change = (name, val) => setModel({ ...model, [name]: val });

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ background: "#0006" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button className="btn-close" onClick={onClose}/>
          </div>

          <div className="modal-body">
            {fields.map(f => (
              <div className="mb-3" key={f.name}>
                <label className="form-label">{f.label}</label>
                {f.type === "select" ? (
                  <select className="form-select"
                          value={model[f.name] || ""}
                          onChange={e => change(f.name, e.target.value)}>
                    <option value=""/>
                    {f.options.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                ) : (
                  <input type={f.type || "text"}
                         className="form-control"
                         value={model[f.name] || ""}
                         onChange={e => change(f.name, e.target.value)}/>
                )}
              </div>
            ))}
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Đóng</button>
            <button className="btn btn-primary" onClick={onSave}>Lưu</button>
          </div>
        </div>
      </div>
    </div>
  );
}
