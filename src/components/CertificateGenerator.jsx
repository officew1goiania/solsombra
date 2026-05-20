import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import './CertificateGenerator.css'

export default function CertificateGenerator({ userName, trilhaName, date, hours }) {
  const certificateRef = useRef(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownloadPdf = async () => {
    if (!certificateRef.current) return

    setIsGenerating(true)
    try {
      // Create a canvas from the hidden certificate DOM element
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2, // Higher quality
        useCORS: true,
        backgroundColor: '#05171E'
      })

      const imgData = canvas.toDataURL('image/png')
      // A4 landscape dimensions: 297mm x 210mm
      const pdf = new jsPDF('landscape', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(`Certificado_W1_Goiania_${trilhaName.replace(/\s+/g, '_')}.pdf`)
    } catch (error) {
      console.error('Erro ao gerar certificado:', error)
      alert('Não foi possível gerar o certificado no momento.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="certificate-wrapper">
      <button 
        onClick={handleDownloadPdf} 
        className="btn-primary certificate-btn"
        disabled={isGenerating}
      >
        {isGenerating ? '⏳ Gerando PDF...' : '🎓 Baixar Certificado Oficial'}
      </button>

      {/* Hidden container for rendering the certificate */}
      <div className="certificate-hidden-area">
        <div ref={certificateRef} className="certificate-template">
          <div className="certificate-template__border-inner">
            <div className="certificate-template__header">
              <div className="certificate-template__logo">
                <span className="logo-w">W1</span> Goiânia
              </div>
              <p className="certificate-template__subtitle">Processo Sol e Sombra</p>
            </div>

            <div className="certificate-template__body">
              <h1 className="certificate-template__title">CERTIFICADO DE CONCLUSÃO</h1>
              <p className="certificate-template__text">Certificamos para os devidos fins que</p>
              <h2 className="certificate-template__name">{userName || 'Consultor W1'}</h2>
              <p className="certificate-template__text">
                concluiu com êxito a trilha de treinamento oficial
              </p>
              <h3 className="certificate-template__course">{trilhaName}</h3>
              <p className="certificate-template__text">
                com carga horária total de <strong>{hours || '4'} horas</strong>, obtendo excelente aproveitamento.
              </p>
            </div>

            <div className="certificate-template__footer">
              <div className="certificate-template__signature">
                <div className="signature-line"></div>
                <p>Diretoria W1 Goiânia</p>
              </div>
              <div className="certificate-template__date">
                <p>Data de emissão: {date || new Date().toLocaleDateString('pt-BR')}</p>
                <p>Validação: W1-GO-{Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="certificate-template__deco-1"></div>
            <div className="certificate-template__deco-2"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
