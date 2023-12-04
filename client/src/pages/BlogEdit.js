import '../css/blogEdit.css';
import { useState } from 'react';
import {useLocation} from'react-router-dom';
import axios from 'axios';

export default function BlogEdit() {
    //získanie parametra z URL
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const encoded = searchParams.get('id');
    //dekodovanie parametra 
    const encodedJsonItem = decodeURIComponent(encoded);
    const item = JSON.parse(encodedJsonItem);
    
    let dbTitle, dbText, dbUrl, dbNumber, dbBlogType;

    if (item !== null) {
        dbTitle = item.title;
        dbText = item.text;
        dbUrl = item.url;
        dbNumber = item.read_time;
        dbBlogType = item.blog_type;
    } else {
        dbTitle = '';
        dbText = '';
        dbUrl = '';
        dbNumber = '';
        dbBlogType = '';
    }

    let [title, setTitle] = useState(dbTitle);
    let [text, setText] = useState(dbText);
    let [url, setUrl] = useState(dbUrl);
    let [number, setNumber] = useState(dbNumber);
    let [blogType, setBlogType] = useState("");
    let [formMessage, setFormMessage] = useState('');

    const cleanInputs = () => {
        title = title.replace(/<script>|<\/script>/gi, '');
        text = text.replace(/<script>|<\/script>/gi, '');
        url = url.replace(/<script>|<\/script>/gi, '');

        title = title.replace(/<\?php/g, '');
        text = text.replace(/<\?php/g, '');
        url = url.replace(/<\?php/g, '');
    };

    const postData = async () => {
        const data = {
            title: title,
            text: text,
            url: url,
            read_time: number,
            blog_type: blogType
        }

        try {
            const response = await axios.post('http://localhost:4000/data', data);
            setFormMessage(<p className="formCheck"> {response.data} </p>);
            window.location.href = '/blog';
          } catch (error) {
            console.error(error);
            setFormMessage(<p className="formError">Chyba pri odosielaní dát</p>);
          }
    };

    const handleSubmit = (e) => {
        cleanInputs();
        e.preventDefault();
        setFormMessage('');
        postData();
    };

    const options = [dbBlogType, "Fitness recepty", "Výživové doplnky", "Strava a zdravý životný štýl", "Cviky a tréningy"].filter((value, index, self) => self.indexOf(value) === index);

    return (
        <div>

            <form className="grid-container" onSubmit={handleSubmit}>
                <div className="title">
                    <label for="text">Názov</label>
                    <input type="text" placeholder="Názov" required minLength={5} maxLength={150} 
                        value={title} onChange={(e) => setTitle(e.target.value)}/>
                </div>
                <br></br>

                <div className="text">
                    <label for="text">Text:</label>
                    <textarea id="text" name="text" rows="4" cols="50" placeholder="Zadejte text..." required maxLength={5000}
                        value={text} onChange={(e) => setText(e.target.value)} ></textarea>
                </div>
                <br></br>

                <div className="upload">
                    <label for="text">Zadaj url obrázka:</label>
                    <input type="url" placeholder="https://" required maxLength={200}
                        value={url} onChange={(e) => setUrl(e.target.value)}></input>
                </div>
                <br></br>  
                
                <div className="readTime">
                    <input type="number" min="1" max="60" step="1" required
                        value={number} onChange={(e) => setNumber(e.target.value)}></input>
                </div>
                <br></br>
                
                <div className="blogType">
                    <select value={blogType} onChange={(e) => setBlogType(e.target.value)}>
                        {options.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
                <br></br>

                <div className="submit-btn">
                    <button type="submit">Odoslať</button>
                </div>
            </form>

        {formMessage}

        </div>
    )
}